#!/usr/bin/env python3
"""
Script to find matching frames between two videos using FFmpeg and image hashing
"""
import subprocess
import hashlib
import os
import tempfile
from collections import defaultdict

VIDEO1 = "public/videos/story1-ai-flow.98e14bd5.mp4"
VIDEO2 = "public/videos/story1-classic-flow.0af286d1.mp4"

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

def find_matching_frames(video1, video2, sample_rate=0.5):
    """
    Find matching frames between two videos
    sample_rate: seconds between frame samples (0.5 = 2 frames per second)
    """
    print(f"Analyzing {video1} and {video2}...")
    print(f"Sample rate: every {sample_rate} seconds\n")

    # Get durations
    duration1 = get_video_duration(video1)
    duration2 = get_video_duration(video2)

    print(f"Video 1 duration: {duration1:.2f}s")
    print(f"Video 2 duration: {duration2:.2f}s\n")

    # Extract hashes from video2
    print("Extracting frames from video 2...")
    video2_hashes = {}
    timestamp = 0
    while timestamp < duration2:
        hash_val = extract_frame_hash(video2, timestamp)
        if hash_val:
            video2_hashes[hash_val] = timestamp
        timestamp += sample_rate

    print(f"Extracted {len(video2_hashes)} unique frames from video 2\n")

    # Find matches in video1
    print("Finding matches in video 1...")
    matches = []
    timestamp = 0
    while timestamp < duration1:
        hash_val = extract_frame_hash(video1, timestamp)
        if hash_val and hash_val in video2_hashes:
            matches.append({
                'video1_time': timestamp,
                'video2_time': video2_hashes[hash_val],
                'hash': hash_val
            })
        timestamp += sample_rate

    return matches

if __name__ == "__main__":
    matches = find_matching_frames(VIDEO1, VIDEO2, sample_rate=0.5)

    print(f"\n{'='*60}")
    print(f"FOUND {len(matches)} MATCHING FRAMES")
    print(f"{'='*60}\n")

    if matches:
        print("Matching frames (timestamp in seconds):")
        print(f"{'Video 1 (AI Flow)':<25} {'Video 2 (Classic Flow)':<25}")
        print("-" * 50)
        for match in matches:
            print(f"{match['video1_time']:>8.2f}s {' '*15} {match['video2_time']:>8.2f}s")
    else:
        print("No matching frames found.")
