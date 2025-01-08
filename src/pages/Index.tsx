import React, { useState } from 'react';
import AudioRecorder from '@/components/AudioRecorder';
import VoiceCloner from '@/components/VoiceCloner';
import VoiceCall from '@/components/VoiceCall';
import { Card } from '@/components/ui/card';
import { Github } from 'lucide-react';

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
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-radial from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl space-y-8">
        <header className="flex justify-between items-center w-full">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">E{'{'}<span className="text-blue-600">h0</span>{'}'}</h1>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm hover:shadow-md transition-shadow"
          >
            <Github className="w-5 h-5" />
            <span>GitHub Repo</span>
          </a>
        </header>

        <Card className="w-full p-8 space-y-8 bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Turn your voice into magic
            </h2>
            <p className="text-gray-600 text-lg">
              Record, clone, and automate your voice with AI
            </p>
          </div>

          <div className="space-y-8">
            <section className="space-y-4">
              <h3 className="text-xl font-medium text-gray-800">Record or Upload Audio</h3>
              <AudioRecorder onAudioRecorded={handleAudioRecorded} />
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-medium text-gray-800">Clone Voice</h3>
              <VoiceCloner
                audioBlob={audioBlob}
                onCloneComplete={handleCloneComplete}
              />
            </section>

            <section className="space-y-4">
              <h3 className="text-xl font-medium text-gray-800">Voice Call</h3>
              <VoiceCall />
            </section>

            {clonedAudioUrl && (
              <section className="space-y-4">
                <h3 className="text-xl font-medium text-gray-800">Cloned Voice Preview</h3>
                <audio
                  controls
                  src={clonedAudioUrl}
                  className="w-full"
                />
              </section>
            )}
          </div>
        </Card>

        <footer className="text-center text-gray-600">
          Powered by ElevenLabs API
        </footer>
      </div>
    </div>
  );
};

export default Index;