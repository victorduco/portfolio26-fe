#!/usr/bin/env python3
"""
Trim static sequences longer than 1 second by cutting them in half
"""
import subprocess
import hashlib
import os

def extract_frame_hash(video_path, timestamp):
    """Extract a frame at a specific timestamp and return its hash"""
    cmd = [
        'ffmpeg', '-ss', str(timestamp), '-i', video_path,
        '-vframes', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'
    ]
    try:
        result = subprocess.run(cmd, stdout=subprocess.PIPE, stderr=subprocess.DEVNULL, check=True)
        return hashlib.md5(result.stdout).hexdigest()
    except subprocess.CalledProcessError:
        return None

def get_video_duration(video_path):
    """Get video duration in seconds"""
    cmd = [
        'ffprobe', '-v', 'error', '-show_entries', 'format=duration',
        '-of', 'default=noprint_wrappers=1:nokey=1', video_path
    ]
    result = subprocess.run(cmd, capture_output=True, text=True, check=True)
    return float(result.stdout.strip())

def find_duplicate_frames(video_path, sample_rate=0.1):
    """Find duplicate consecutive frames in a video"""
    duration = get_video_duration(video_path)

    # Extract all frame hashes
    frames = []
    timestamp = 0
    while timestamp < duration:
        hash_val = extract_frame_hash(video_path, timestamp)
        if hash_val:
            frames.append({'time': timestamp, 'hash': hash_val})
        timestamp += sample_rate

    # Find consecutive duplicates
    duplicate_sequences = []
    current_sequence = None

    for i in range(len(frames) - 1):
        if frames[i]['hash'] == frames[i + 1]['hash']:
            if current_sequence is None:
                current_sequence = {
                    'start_time': frames[i]['time'],
                    'end_time': frames[i + 1]['time'],
                    'hash': frames[i]['hash'],
                    'count': 2
                }
            else:
                current_sequence['end_time'] = frames[i + 1]['time']
                current_sequence['count'] += 1
        else:
            if current_sequence and current_sequence['count'] >= 3:
                duplicate_sequences.append(current_sequence)
            current_sequence = None

    if current_sequence and current_sequence['count'] >= 3:
        duplicate_sequences.append(current_sequence)

    return duplicate_sequences

def create_trimmed_video(input_video, output_video, sequences_to_trim):
    """Create a new video with static sequences trimmed"""

    # Filter sequences longer than 1 second
    long_sequences = [s for s in sequences_to_trim if (s['end_time'] - s['start_time']) > 1.0]

    if not long_sequences:
        print("No sequences longer than 1 second found. No trimming needed.")
        return

    print(f"\nSequences to trim (>{1.0}s):")
    for seq in long_sequences:
        duration = seq['end_time'] - seq['start_time']
        new_duration = duration / 2
        print(f"  {seq['start_time']:.2f}s - {seq['end_time']:.2f}s "
              f"(duration: {duration:.2f}s -> {new_duration:.2f}s)")

    # Build FFmpeg filter complex to trim these segments
    # Strategy: create segments and concatenate them

    segments = []
    current_time = 0.0

    for seq in sorted(long_sequences, key=lambda x: x['start_time']):
        start = seq['start_time']
        end = seq['end_time']
        duration = end - start
        trim_amount = duration / 2  # Cut in half

        # Add segment before this static sequence
        if start > current_time:
            segments.append({
                'start': current_time,
                'end': start,
                'type': 'keep'
            })

        # Add trimmed static sequence (keep only half)
        segments.append({
            'start': start,
            'end': start + trim_amount,
            'type': 'trimmed'
        })

        current_time = end

    # Add final segment after last static sequence
    video_duration = get_video_duration(input_video)
    if current_time < video_duration:
        segments.append({
            'start': current_time,
            'end': video_duration,
            'type': 'keep'
        })

    # Build FFmpeg command with segment concatenation (video only, no audio)
    filter_parts = []
    for i, seg in enumerate(segments):
        duration = seg['end'] - seg['start']
        filter_parts.append(f"[0:v]trim=start={seg['start']:.3f}:end={seg['end']:.3f},setpts=PTS-STARTPTS[v{i}];")

    # Concatenate all segments
    concat_inputs = ''.join([f"[v{i}]" for i in range(len(segments))])
    filter_complex = ''.join(filter_parts) + f"{concat_inputs}concat=n={len(segments)}:v=1:a=0[outv]"

    cmd = [
        'ffmpeg', '-i', input_video,
        '-filter_complex', filter_complex,
        '-map', '[outv]',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '23',
        '-y', output_video
    ]

    print(f"\nTrimming video...")
    print(f"Input: {input_video}")
    print(f"Output: {output_video}")
    print(f"Segments: {len(segments)}")

    result = subprocess.run(cmd, capture_output=True, text=True)

    if result.returncode == 0:
        original_duration = get_video_duration(input_video)
        new_duration = get_video_duration(output_video)
        time_saved = original_duration - new_duration

        print(f"\n✓ Success!")
        print(f"  Original duration: {original_duration:.2f}s")
        print(f"  New duration: {new_duration:.2f}s")
        print(f"  Time saved: {time_saved:.2f}s ({time_saved/original_duration*100:.1f}%)")
    else:
        print(f"\n✗ Error occurred:")
        print(result.stderr)

if __name__ == "__main__":
    input_video = "public/videos/story1-ai-flow.98e14bd5.mp4"
    output_video = "public/videos/story1-ai-flow-trimmed.mp4"

    print("Analyzing video for static sequences...")
    sequences = find_duplicate_frames(input_video, sample_rate=0.1)

    print(f"Found {len(sequences)} static sequences")

    create_trimmed_video(input_video, output_video, sequences)
