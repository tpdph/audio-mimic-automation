import React, { useState, useRef } from 'react';
import { Mic, Square, Upload, Play, Pause, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { extractAudioFromVideo, extractAudioFromYouTube, isYouTubeUrl } from '@/utils/audioExtractor';

interface AudioRecorderProps {
  onAudioRecorded: (blob: Blob) => void;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({ onAudioRecorded }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [audioURL, setAudioURL] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioURL(audioUrl);
        onAudioRecorded(audioBlob);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.success('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Error accessing microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    try {
      let audioBlob: Blob;
      
      if (file.type.startsWith('audio/')) {
        audioBlob = file;
      } else if (file.type.startsWith('video/')) {
        toast.info('Extracting audio from video...');
        audioBlob = await extractAudioFromVideo(file);
      } else {
        toast.error('Unsupported file type');
        return;
      }

      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      onAudioRecorded(audioBlob);
      toast.success('Audio processed successfully');
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error('Error processing file');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleYouTubeExtraction = async () => {
    if (!youtubeUrl) {
      toast.error('Please enter a YouTube URL');
      return;
    }

    if (!isYouTubeUrl(youtubeUrl)) {
      toast.error('Invalid YouTube URL');
      return;
    }

    setIsProcessing(true);
    try {
      toast.info('Extracting audio from YouTube...');
      const audioBlob = await extractAudioFromYouTube(youtubeUrl);
      const url = URL.createObjectURL(audioBlob);
      setAudioURL(url);
      onAudioRecorded(audioBlob);
      toast.success('YouTube audio extracted successfully');
    } catch (error) {
      console.error('Error extracting YouTube audio:', error);
      toast.error('Failed to extract audio from YouTube');
    } finally {
      setIsProcessing(false);
    }
  };

  const togglePlayback = () => {
    if (audioElementRef.current) {
      if (isPlaying) {
        audioElementRef.current.pause();
      } else {
        audioElementRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-4">
        <div className="flex justify-center space-x-4">
          <Button
            onClick={isRecording ? stopRecording : startRecording}
            className={`relative overflow-hidden transition-all duration-300 ${
              isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-primary/90'
            }`}
            disabled={isProcessing}
          >
            {isRecording ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Stop Recording
                <span className="absolute inset-0 recording-pulse" />
              </>
            ) : (
              <>
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </>
            )}
          </Button>

          <label className="cursor-pointer">
            <Button asChild disabled={isProcessing}>
              <span>
                <Upload className="w-4 h-4 mr-2" />
                Upload File
              </span>
            </Button>
            <input
              type="file"
              accept="audio/*,video/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        <div className="flex space-x-2">
          <Input
            type="url"
            placeholder="Enter YouTube URL"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            className="flex-1"
            disabled={isProcessing}
          />
          <Button
            onClick={handleYouTubeExtraction}
            disabled={!youtubeUrl || isProcessing}
            variant="outline"
          >
            <Link className="w-4 h-4 mr-2" />
            Extract
          </Button>
        </div>
      </div>

      {audioURL && (
        <div className="flex flex-col items-center space-y-2">
          <audio ref={audioElementRef} src={audioURL} className="hidden" onEnded={() => setIsPlaying(false)} />
          <Button onClick={togglePlayback} variant="outline" className="w-full max-w-xs">
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Play Recording
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AudioRecorder;
