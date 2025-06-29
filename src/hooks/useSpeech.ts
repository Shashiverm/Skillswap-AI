import { useState, useCallback, useRef } from 'react';
import { SpeechRecognitionService } from '../lib/speech';

export const useSpeech = () => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const speechService = useRef(new SpeechRecognitionService());

  const startListening = useCallback(async () => {
    if (!speechService.current.isSupported()) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    try {
      setError(null);
      setTranscript('');
      
      await speechService.current.startListening(
        (text, isFinal) => {
          setTranscript(text);
          if (isFinal) {
            setIsListening(false);
          }
        },
        (error) => {
          setError(error);
          setIsListening(false);
        }
      );
      
      setIsListening(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start listening');
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    speechService.current.stopListening();
    setIsListening(false);
  }, []);

  const clearTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    clearTranscript,
    isSupported: speechService.current.isSupported(),
  };
};