import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Send } from 'lucide-react';
import { toast } from 'sonner';

interface VoiceClonerProps {
  audioBlob: Blob | null;
  onCloneComplete: (clonedAudioUrl: string) => void;
}

const VoiceCloner: React.FC<VoiceClonerProps> = ({ audioBlob, onCloneComplete }) => {
  const [apiKey, setApiKey] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCloneVoice = async () => {
    if (!audioBlob) {
      toast.error('Please record or upload audio first');
      return;
    }

    if (!apiKey) {
      toast.error('Please enter your API key');
      return;
    }

    setIsProcessing(true);

    try {
      // Here you would implement the actual API call to your voice cloning service
      // This is a placeholder for demonstration
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate a successful response
      const mockClonedAudioUrl = URL.createObjectURL(audioBlob);
      onCloneComplete(mockClonedAudioUrl);
      toast.success('Voice cloned successfully');
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
        <Label htmlFor="apiKey">API Key</Label>
        <Input
          id="apiKey"
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your API key"
          className="max-w-md"
        />
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