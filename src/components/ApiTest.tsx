import React, { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import { generateImage } from '../lib/replicate';

export function ApiTest() {
  const [prompt, setPrompt] = useState('A beautiful landscape with mountains and a lake');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const url = await generateImage(prompt);
      setImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="max-w-xl w-full p-6 glass-panel m-4">
        <h2 className="text-2xl font-bold gradient-text mb-6">API Test</h2>
        
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-white/60 mb-2">
              Prompt
            </label>
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg py-2 px-3 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
              placeholder="Describe your image..."
            />
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-lg py-3 font-medium hover:from-emerald-600 hover:to-teal-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mb-4"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              Generating...
            </>
          ) : (
            'Generate Image'
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-400 font-medium mb-1">Error Occurred</p>
                <p className="text-red-400/80 text-sm whitespace-pre-line">{error}</p>
                {!import.meta.env.VITE_REPLICATE_API_TOKEN && (
                  <p className="text-red-400/60 text-sm mt-2">
                    Create a .env file in the project root and add:
                    <code className="block mt-1 p-2 bg-black/20 rounded font-mono text-xs">
                      VITE_REPLICATE_API_TOKEN=your-token-here
                    </code>
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {imageUrl && (
          <div className="rounded-lg overflow-hidden bg-white/5 p-1">
            <img 
              src={imageUrl} 
              alt="Generated image" 
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}