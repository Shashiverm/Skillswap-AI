import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { useSpeech } from '../../hooks/useSpeech';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  placeholder?: string;
}

export const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript, placeholder = "Try saying: 'I need a plumber' or 'Find me a web developer'" }) => {
  const {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    clearTranscript,
    isSupported,
  } = useSpeech();

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript);
    }
  }, [transcript, onTranscript]);

  const handleToggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      clearTranscript();
      startListening();
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
        <Volume2 className="w-6 h-6 text-gray-400 mx-auto mb-2" />
        <p className="text-gray-500 text-sm">Voice input not supported in this browser</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <div className="text-center mb-4">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleToggleListening}
          className={`relative p-4 rounded-full transition-all duration-300 ${
            isListening
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isListening ? (
            <MicOff className="w-8 h-8" />
          ) : (
            <Mic className="w-8 h-8" />
          )}
          
          {isListening && (
            <motion.div
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: 1.3, opacity: 0 }}
              transition={{ duration: 1, repeat: Infinity }}
              className="absolute inset-0 bg-red-500 rounded-full"
            />
          )}
        </motion.button>
      </div>

      <div className="text-center">
        {isListening ? (
          <div>
            <p className="text-red-600 font-semibold mb-2">Listening...</p>
            {transcript && (
              <div className="bg-gray-50 rounded-lg p-3 min-h-[50px] border-2 border-dashed border-red-200">
                <p className="text-gray-800">{transcript}</p>
              </div>
            )}
          </div>
        ) : (
          <div>
            <p className="text-gray-600 font-medium mb-2">
              {transcript ? 'Voice input captured!' : 'Tap to speak'}
            </p>
            {transcript ? (
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <p className="text-blue-800 font-medium">{transcript}</p>
              </div>
            ) : (
              <p className="text-gray-400 text-sm">{placeholder}</p>
            )}
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm mt-2 bg-red-50 p-2 rounded-lg">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};