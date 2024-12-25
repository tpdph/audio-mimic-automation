import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import ytdl from 'ytdl-core';

export async function extractAudioFromVideo(file: File): Promise<Blob> {
  console.log('Starting audio extraction from video file');
  const ffmpeg = new FFmpeg();
  await ffmpeg.load();

  const videoData = await file.arrayBuffer();
  await ffmpeg.writeFile('input.mp4', new Uint8Array(videoData));
  
  await ffmpeg.exec(['-i', 'input.mp4', '-vn', '-acodec', 'pcm_s16le', '-ar', '44100', '-ac', '2', 'output.wav']);
  
  const audioData = await ffmpeg.readFile('output.wav');
  return new Blob([audioData], { type: 'audio/wav' });
}

export async function extractAudioFromYouTube(url: string): Promise<Blob> {
  console.log('Starting audio extraction from YouTube URL:', url);
  
  try {
    const videoInfo = await ytdl.getInfo(url);
    const audioFormat = ytdl.chooseFormat(videoInfo.formats, { quality: 'highestaudio' });
    
    const response = await fetch(audioFormat.url);
    const audioBlob = await response.blob();
    return audioBlob;
  } catch (error) {
    console.error('Error extracting audio from YouTube:', error);
    throw new Error('Failed to extract audio from YouTube URL');
  }
}

export function isYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return youtubeRegex.test(url);
}