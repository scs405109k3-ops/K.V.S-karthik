import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from '@google/genai';
import { MovieIcon } from '../components/icons';

// Helper to convert file to base64
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = error => reject(error);
});

const VideoGeneration: React.FC = () => {
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [aspectRatio, setAspectRatio] = useState<'16:9' | '9:16'>('16:9');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
    const [progress, setProgress] = useState<string>('');
    const [isKeySelected, setIsKeySelected] = useState(false);

    const checkApiKey = async () => {
        const hasKey = await window.aistudio.hasSelectedApiKey();
        setIsKeySelected(hasKey);
    };

    useEffect(() => {
        checkApiKey();
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };
    
    const handleSelectKey = async () => {
        await window.aistudio.openSelectKey();
        // Assume success and update UI immediately to avoid race conditions
        setIsKeySelected(true);
    };

    const handleGenerate = async () => {
        if (!imageFile) {
            setError('Please upload an image.');
            return;
        }

        await checkApiKey();
        if (!isKeySelected) {
            setError('Please select an API key to generate videos.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setGeneratedVideo(null);
        setProgress('Initializing video generation...');

        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const imageBytes = await toBase64(imageFile);
            
            setProgress('Sending request to VEO model... This may take a few minutes.');
            let operation = await ai.models.generateVideos({
                model: 'veo-3.1-fast-generate-preview',
                prompt: prompt || 'Animate this image.',
                image: {
                    imageBytes,
                    mimeType: imageFile.type,
                },
                config: {
                    numberOfVideos: 1,
                    resolution: '720p',
                    aspectRatio,
                }
            });

            setProgress('Video generation in progress. Polling for results...');
            while (!operation.done) {
                await new Promise(resolve => setTimeout(resolve, 10000));
                operation = await ai.operations.getVideosOperation({ operation });
                setProgress(`Processing... State: ${operation.metadata?.state || 'UNKNOWN'}`);
            }

            if(operation.error) {
                throw new Error(operation.error.message || 'Operation failed');
            }

            setProgress('Fetching generated video...');
            const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
            if (downloadLink) {
                const response = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
                const videoBlob = await response.blob();
                setGeneratedVideo(URL.createObjectURL(videoBlob));
                setProgress('Video generated successfully!');
            } else {
                throw new Error('No video URI returned from the operation.');
            }

        } catch (err: any) {
            console.error(err);
            let errorMessage = 'An error occurred during video generation.';
            if (err.message?.includes('Requested entity was not found')) {
                errorMessage = 'API Key is invalid. Please select a valid key.';
                setIsKeySelected(false);
            }
            setError(errorMessage);
            setProgress('');
        } finally {
            setIsLoading(false);
        }
    };
    
    if(!isKeySelected) {
        return (
             <div className="flex flex-col h-full items-center justify-center p-8 text-center">
                 <MovieIcon className="w-12 h-12 mb-4" />
                 <h1 className="text-2xl font-bold mb-2">Video Generation with VEO</h1>
                 <p className="text-namaste-light-grey mb-4">This feature requires a project-based API key for billing.</p>
                 <button onClick={handleSelectKey} className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors">Select API Key</button>
                 <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 mt-4 hover:underline">Learn more about billing</a>
             </div>
        );
    }

    return (
        <div className="flex flex-col h-full p-4 overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto">
                <div className="text-center mb-8">
                    <MovieIcon className="w-8 h-8 mx-auto mb-2" />
                    <h1 className="text-3xl font-bold">Video Generation</h1>
                    <p className="text-namaste-light-grey">Bring your images to life with VEO.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Controls Column */}
                    <div>
                        <div className="mb-4">
                            <label className="block mb-2 font-bold">1. Upload Image</label>
                            <input type="file" accept="image/*" onChange={handleImageChange} className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2 font-bold">2. Describe the animation (optional)</label>
                            <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="e.g., A gentle breeze rustles the leaves" rows={3} className="w-full bg-namaste-light-dark border-namaste-grey rounded-lg p-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" />
                        </div>
                        <div className="mb-6">
                           <label className="block mb-2 font-bold">3. Select Aspect Ratio</label>
                           <div className="flex gap-2">
                               <button onClick={() => setAspectRatio('16:9')} className={`px-4 py-2 rounded-md ${aspectRatio === '16:9' ? 'bg-blue-600' : 'bg-namaste-grey'}`}>16:9 (Landscape)</button>
                               <button onClick={() => setAspectRatio('9:16')} className={`px-4 py-2 rounded-md ${aspectRatio === '9:16' ? 'bg-blue-600' : 'bg-namaste-grey'}`}>9:16 (Portrait)</button>
                           </div>
                        </div>
                        <button onClick={handleGenerate} disabled={isLoading || !imageFile} className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors">
                            {isLoading ? 'Generating Video...' : 'Generate Video'}
                        </button>
                    </div>

                    {/* Preview Column */}
                    <div className="flex flex-col items-center justify-center bg-namaste-light-dark rounded-lg p-4 min-h-[300px]">
                        {isLoading ? (
                            <div className="text-center">
                                <p className="text-lg font-semibold">Processing...</p>
                                <p className="text-sm text-namaste-light-grey">{progress}</p>
                            </div>
                        ) : generatedVideo ? (
                            <video src={generatedVideo} controls autoPlay loop className="w-full h-auto rounded-md" />
                        ) : imagePreview ? (
                            <img src={imagePreview} alt="Image preview" className="max-w-full max-h-[400px] rounded-md" />
                        ) : (
                            <p className="text-namaste-light-grey">Preview will appear here</p>
                        )}
                        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VideoGeneration;
