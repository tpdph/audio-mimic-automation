import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceClonerProps {
  audioBlob: Blob | null;
  onCloneComplete: (clonedAudioUrl: string) => void;
}

const VoiceCloner: React.FC<VoiceClonerProps> = ({ audioBlob, onCloneComplete }) => {
  const [apiKey, setApiKey] = useState('');
  const [selectedVoice, setSelectedVoice] = useState('21m00Tcm4TlvDq8ikWAM');
  const [isProcessing, setIsProcessing] = useState(false);

  const voices = [
    { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel' },
    { id: 'CwhRBWXzGAHq8TQ4Fs17', name: 'Roger' },
    { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Sarah' },
    { id: 'FGY2WhTYpPnrIDTdsKH5', name: 'Laura' },
    { id: 'IKne3meq5aSn9XLyUdCD', name: 'Charlie' }
  ];

  const handleCloneVoice = async () => {
    if (!audioBlob) {
      toast.error('Please record or upload audio first');
      return;
    }

    if (!apiKey) {
      toast.error('Please enter your ElevenLabs API key');
      return;
    }

    setIsProcessing(true);

    try {
      // Convert audio blob to base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result?.toString().split(',')[1];
        
        const response = await fetch('https://api.elevenlabs.io/v1/voice-generation/text-to-speech', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'xi-api-key': apiKey,
          },
          body: JSON.stringify({
            text: "This is a voice cloning test",
            voice_id: selectedVoice,
            model_id: "eleven_multilingual_v2",
          }),
        });

        if (!response.ok) {
          throw new Error('Voice cloning failed');
        }

        const audioBlob = await response.blob();
        const url = URL.createObjectURL(audioBlob);
        onCloneComplete(url);
        toast.success('Voice cloned successfully');
      };
    } catch (error) {
      console.error('Error cloning voice:', error);
      toast.error('Error cloning voice');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="apiKey">ElevenLabs API Key</Label>
        <Input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your ElevenLabs API key"
          className="max-w-md"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="voice">Select Voice</Label>
        <Select value={selectedVoice} onValueChange={setSelectedVoice}>
          <SelectTrigger className="max-w-md">
            <SelectValue placeholder="Select a voice" />
          </SelectTrigger>
          <SelectContent>
            {voices.map((voice) => (
              <SelectItem key={voice.id} value={voice.id}>
                {voice.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleCloneVoice}
        disabled={isProcessing || !audioBlob}
        className="w-full max-w-md"
      >
        {isProcessing ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Clone Voice
          </>
        )}
      </Button>
    </Card>
  );
};

export default VoiceCloner;