import React, { useState, useEffect } from 'react';
import type { User } from 'firebase/auth';
import { GoogleGenAI } from '@google/genai';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy } from 'firebase/firestore';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { ImageIcon } from '../components/icons';

interface ImageGenerationProps {
  user: User;
}

interface GeneratedImageRecord {
  id: string;
  prompt: string;
  imageUrl: string;
}

const ImageGeneration: React.FC<ImageGenerationProps> = ({ user }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [history, setHistory] = useState<GeneratedImageRecord[]>([]);
  const [ai, setAi] = useState<GoogleGenAI | null>(null);

  useEffect(() => {
    if (process.env.API_KEY) {
      setAi(new GoogleGenAI({ apiKey: process.env.API_KEY }));
    }
  }, []);
  
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'images'), 
      orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const imageHistory: GeneratedImageRecord[] = [];
      querySnapshot.forEach((doc) => {
        imageHistory.push({ id: doc.id, ...doc.data() } as GeneratedImageRecord);
      });
      setHistory(imageHistory);
    });

    return () => unsubscribe();
  }, [user]);

  const handleGenerate = async () => {
    if (!ai || !prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);

    try {
      const response = await ai.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: '1:1',
        },
      });

      if (response.generatedImages && response.generatedImages.length > 0) {
        const base64ImageBytes = response.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64ImageBytes}`;
        setGeneratedImage(imageUrl);
        
        // Save to Firebase
        const storageRef = ref(storage, `users/${user.uid}/images/${Date.now()}.jpg`);
        const uploadResult = await uploadString(storageRef, imageUrl, 'data_url');
        const downloadURL = await getDownloadURL(uploadResult.ref);

        await addDoc(collection(db, 'users', user.uid, 'images'), {
          prompt: prompt,
          imageUrl: downloadURL,
          createdAt: serverTimestamp(),
        });

      } else {
        setError('Image generation failed. No images were returned.');
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred during image generation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full overflow-y-auto p-8">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <ImageIcon className="w-8 h-8" />
            <h1 className="text-3xl font-bold">Image Generation</h1>
          </div>
          <p className="text-namaste-light-grey mb-8">
            Describe the image you want to create. Be as specific as you can.
          </p>
        </div>

        <div className="relative mb-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="e.g., A majestic lion wearing a crown, photorealistic"
            rows={3}
            className="w-full bg-namaste-light-dark border-namaste-grey rounded-lg p-4 pr-14 text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            disabled={isLoading}
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg disabled:bg-opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          {isLoading ? 'Generating...' : 'Generate'}
        </button>

        {error && <p className="text-red-400 mt-4 text-center">{error}</p>}

        <div className="mt-8 p-4 bg-namaste-light-dark rounded-lg min-h-[300px] flex items-center justify-center">
          {isLoading ? (
            <div className="text-namaste-light-grey">Generating your image...</div>
          ) : generatedImage ? (
            <img src={generatedImage} alt="Generated" className="rounded-lg max-w-full max-h-[512px]" />
          ) : (
            <div className="text-namaste-light-grey">Your generated image will appear here.</div>
          )}
        </div>
      </div>
      
      <div className="w-full max-w-5xl mx-auto mt-12">
          <h2 className="text-2xl font-bold text-center mb-6">Your Gallery</h2>
          {history.length > 0 ? (
             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
               {history.map(item => (
                 <div key={item.id} className="group relative">
                   <img src={item.imageUrl} alt={item.prompt} className="w-full h-full object-cover rounded-lg"/>
                   <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-2 text-xs opacity-0 group-hover:opacity-100 transition-opacity rounded-b-lg">
                     {item.prompt}
                   </div>
                 </div>
               ))}
             </div>
          ) : (
            <p className="text-center text-namaste-light-grey">You haven't generated any images yet.</p>
          )}
      </div>
    </div>
  );
};

export default ImageGeneration;