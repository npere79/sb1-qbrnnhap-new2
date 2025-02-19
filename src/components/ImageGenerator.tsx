import React, { useState } from 'react';
import { Loader2, AlertTriangle } from 'lucide-react';
import Replicate from 'replicate';

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

export function ImageGenerator() {
  const [prompt, setPrompt] = useState('A beautiful sunset over a calm ocean');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('Ready to generate');

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    setStatus('Preparing request...');
    setImageUrl(null);

    try {
      setStatus('Creating prediction...');
      const prediction = await replicate.predictions.create({
        version: "black-forest-labs/flux-schnell",
        input: {
          prompt: prompt
        }
      });

      setStatus('Waiting for image generation...');
      
      // Poll for the result
      let result;
      while (true) {
        result = await replicate.predictions.get(prediction.id);
        if (result.status === "succeeded" || result.status === "failed") {
          break;
        }
        setStatus(`Processing: ${result.status}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      if (result.status === "succeeded" && result.output) {
        setImageUrl(result.output);
        setStatus('');
      } else {
        throw new Error('Failed to generate image');
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate image';
      console.error('Image generation error:', err);
      setError(message);
      setStatus('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black">
      <div className="max-w-xl w-full p-6 glass-panel m-4">
        <h2 className="text-2xl font-bold gradient-text mb-6">AI Image Generator</h2>

        <div className="space-y-6 mb-6">
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
              <span>{status}</span>
            </>
          ) : (
            'Generate Image'
          )}
        </button>
        
        {loading && !error && (
          <div className="p-4 bg-white/5 border border-white/10 rounded-lg mb-4">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Loader2 className="w-5 h-5 text-emerald-400 animate-spin" />
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-lg" />
              </div>
              <p className="text-white/80 font-medium">{status}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-red-400 font-medium mb-1">{
                  error.includes('canceled') ? 'Generation Canceled' :
                  error.includes('API token') ? 'Missing API Token' :
                  error.includes('Network') ? 'Connection Error' :
                  'Error Occurred'
                }</p>
                <p className="text-red-400/80 text-sm whitespace-pre-line">{error}</p>
              </div>
            </div>
          </div>
        )}

        {imageUrl && (
          <div className="rounded-lg overflow-hidden bg-white/5 p-1 shadow-lg shadow-emerald-500/10">
            <img 
              src={imageUrl} 
              alt="Generated image" 
              className="w-full h-auto rounded-lg transform hover:scale-[1.02] transition-transform duration-300"
            />
          </div>
        )}
      </div>
    </div>
  );
}