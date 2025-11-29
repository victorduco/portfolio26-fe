#!/usr/bin/env python3
"""
Find duplicate/identical consecutive frames within videos
This helps identify static moments where nothing is happening
"""
import subprocess
import hashlib
from collections import defaultdict

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
    """
    Find duplicate consecutive frames in a video
    sample_rate: seconds between frame samples (0.1 = 10 frames per second for 60fps video)
    """
    print(f"\nAnalyzing {video_path}")
    print(f"Sample rate: every {sample_rate} seconds")

    duration = get_video_duration(video_path)
    print(f"Duration: {duration:.2f}s\n")

    # Extract all frame hashes
    print("Extracting frames...")
    frames = []
    timestamp = 0
    while timestamp < duration:
        hash_val = extract_frame_hash(video_path, timestamp)
        if hash_val:
            frames.append({'time': timestamp, 'hash': hash_val})
        timestamp += sample_rate

    print(f"Extracted {len(frames)} frames\n")

    # Find consecutive duplicates
    duplicate_sequences = []
    current_sequence = None

    for i in range(len(frames) - 1):
        if frames[i]['hash'] == frames[i + 1]['hash']:
            if current_sequence is None:
                # Start new sequence
                current_sequence = {
                    'start_time': frames[i]['time'],
                    'end_time': frames[i + 1]['time'],
                    'hash': frames[i]['hash'],
                    'count': 2
                }
            else:
                # Continue sequence
                current_sequence['end_time'] = frames[i + 1]['time']
                current_sequence['count'] += 1
        else:
            # Sequence ended
            if current_sequence and current_sequence['count'] >= 3:  # Only report sequences of 3+ frames
                duplicate_sequences.append(current_sequence)
            current_sequence = None

    # Don't forget the last sequence
    if current_sequence and current_sequence['count'] >= 3:
        duplicate_sequences.append(current_sequence)

    return duplicate_sequences, len(frames)

def format_time(seconds):
    """Format seconds as MM:SS.ms"""
    mins = int(seconds // 60)
    secs = seconds % 60
    return f"{mins:02d}:{secs:05.2f}"

def analyze_video(video_path):
    """Analyze a video and print duplicate frame report"""
    sequences, total_frames = find_duplicate_frames(video_path, sample_rate=0.1)

    print("=" * 70)
    print(f"DUPLICATE FRAME SEQUENCES (3+ identical consecutive frames)")
    print("=" * 70)

    if sequences:
        total_static_time = sum(seq['end_time'] - seq['start_time'] for seq in sequences)
        print(f"\nFound {len(sequences)} static sequences")
        print(f"Total static time: {total_static_time:.2f}s\n")

        print(f"{'Start':<12} {'End':<12} {'Duration':<12} {'Frames':<8}")
        print("-" * 70)

        for seq in sequences:
            duration = seq['end_time'] - seq['start_time']
            print(f"{format_time(seq['start_time']):<12} "
                  f"{format_time(seq['end_time']):<12} "
                  f"{duration:.2f}s{'':<8} "
                  f"{seq['count']}")
    else:
        print("\nNo duplicate frame sequences found (all frames are unique)")

    print("\n")

if __name__ == "__main__":
    videos = [
        "public/videos/story1-ai-flow.98e14bd5.mp4",
        "public/videos/story1-classic-flow.0af286d1.mp4"
    ]

    for video in videos:
        analyze_video(video)
        print("\n" + "=" * 70 + "\n")
