import React from 'react';
import { useConversation } from '@11labs/react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { toast } from 'sonner';

const VoiceCall = () => {
  const [isCallActive, setIsCallActive] = React.useState(false);
  const [apiKey, setApiKey] = React.useState('');
  const conversation = useConversation();

  const startCall = async () => {
    if (!apiKey) {
      toast.error("Please enter your ElevenLabs API key");
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      await conversation.startSession({
        agentId: "LAPzJ3YjC5oh2WdZVSD4",
        headers: {
          'xi-api-key': apiKey
        }
      });
      setIsCallActive(true);
      toast.success("Call connected with Natalia");
    } catch (error) {
      console.error('Error starting call:', error);
      toast.error("Failed to start call. Please check microphone permissions and API key.");
    }
  };

  const endCall = async () => {
    try {
      await conversation.endSession();
      setIsCallActive(false);
      toast.success("Call ended");
    } catch (error) {
      console.error('Error ending call:', error);
      toast.error("Error ending call");
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Voice Call with Natalia</h2>
        <p className="text-sm text-muted-foreground">
          Start a voice conversation with your AI assistant Natalia
        </p>
      </div>

      <div className="space-y-4">
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

        <Button
          onClick={isCallActive ? endCall : startCall}
          variant={isCallActive ? "destructive" : "default"}
          className="w-full"
        >
          {isCallActive ? (
            <>
              <PhoneOff className="w-4 h-4 mr-2" />
              End Call
            </>
          ) : (
            <>
              <Phone className="w-4 h-4 mr-2" />
              Start Call
            </>
          )}
        </Button>
      </div>

      {isCallActive && (
        <div className="flex items-center justify-center p-4">
          <div className="recording-pulse">
            <Mic className="w-6 h-6 text-red-500" />
          </div>
        </div>
      )}
    </Card>
  );
};

export default VoiceCall;