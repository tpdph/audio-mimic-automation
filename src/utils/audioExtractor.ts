import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

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
  
  // Use a proxy service or backend API that can handle YouTube downloads
  const proxyUrl = `https://youtube-dl-proxy.herokuapp.com/download?url=${encodeURIComponent(url)}`;
  
  try {
    const response = await fetch(proxyUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch audio from YouTube');
    }
    return await response.blob();
  } catch (error) {
    console.error('Error extracting audio from YouTube:', error);
    throw new Error('Failed to extract audio from YouTube URL');
  }
}

export function isYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;
  return youtubeRegex.test(url);
}