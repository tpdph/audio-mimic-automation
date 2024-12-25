import React, { useState } from 'react';
import AudioRecorder from '@/components/AudioRecorder';
import VoiceCloner from '@/components/VoiceCloner';
import VoiceCall from '@/components/VoiceCall';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [clonedAudioUrl, setClonedAudioUrl] = useState<string | null>(null);

  const handleAudioRecorded = (blob: Blob) => {
    setAudioBlob(blob);
  };

  const handleCloneComplete = (url: string) => {
    setClonedAudioUrl(url);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-2xl p-8 space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight">Voice Note Automation</h1>
          <p className="text-muted-foreground">Record, clone, and automate your voice notes</p>
        </div>

        <div className="space-y-8">
          <section className="space-y-4">
            <h2 className="text-xl font-medium">Record or Upload Audio</h2>
            <AudioRecorder onAudioRecorded={handleAudioRecorded} />
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">Clone Voice</h2>
            <VoiceCloner
              audioBlob={audioBlob}
              onCloneComplete={handleCloneComplete}
            />
          </section>

          <section className="space-y-4">
            <h2 className="text-xl font-medium">Voice Call</h2>
            <VoiceCall />
          </section>

          {clonedAudioUrl && (
            <section className="space-y-4">
              <h2 className="text-xl font-medium">Cloned Voice Preview</h2>
              <audio
                controls
                src={clonedAudioUrl}
                className="w-full"
              />
            </section>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Index;