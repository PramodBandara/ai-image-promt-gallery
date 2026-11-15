'use client';

import React, { useState } from 'react';
import { supabase } from '../lib/supabase';
import Navbar from '../components/Navbar';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [model, setModel] = useState<string>('Midjourney');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    const selectedFile = e.target.files?.[0] ?? null;
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        setErrorMsg('Please select a valid image file.');
        setFile(null);
        setPreviewUrl(null);
        return;
      }
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    } else {
      setFile(null);
      setPreviewUrl(null);
    }
  };
  

  const handleUpload = async () => {
    setErrorMsg(null);
    setSuccessMsg(null);
    if (!file) {
      setErrorMsg('No file selected.');
      return;
    }
    setLoading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = fileName;

      const { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        setErrorMsg(uploadError.message);
        setLoading(false);
        return;
      }

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        setErrorMsg('User not logged in.');
        setLoading(false);
        return;
      }
      const userId = userData.user.id;

      const publicUrl = supabase.storage.from('images').getPublicUrl(filePath).data.publicUrl;

      const { error: insertError } = await supabase
        .from('images')
        .insert([{ user_id: userId, image_url: publicUrl, status: 'pending', prompt: prompt, model: model }]);

      if (insertError) {
        setErrorMsg(insertError.message);
        setLoading(false);
        return;
      }

      setSuccessMsg('Upload successful!');
      setFile(null);
      setPreviewUrl(null);
      setPrompt('');
      setModel('Midjourney');
    } catch (error) {
      setErrorMsg('Upload failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white text-black flex items-center justify-center px-4 py-20">
        <div className="w-full max-w-lg bg-white border border-gray-200 rounded-2xl p-8">
          <h1 className="text-2xl font-semibold mb-8 text-center">
            Upload Image
          </h1>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4
                       file:rounded-lg file:border file:border-gray-300
                       file:text-sm file:font-medium
                       file:bg-gray-100 file:text-gray-700
                       hover:file:bg-gray-200
                       border border-gray-300 rounded-lg cursor-pointer"
          />
          {previewUrl && (
            <div className="my-6 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full max-h-72 object-contain"
              />
            </div>
          )}
          <div className="mt-6">
            <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
            <textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={3}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
          <div className="mt-6">
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-2">Model</label>
            <select
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            >
              <option value="Midjourney">Midjourney</option>
              <option value="Nano Banana">Nano Banana</option>
              <option value="DALL·E 3">DALL·E 3</option>
              <option value="Leonardo">Leonardo</option>
            </select>
          </div>
          {errorMsg && (
            <p className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
              {errorMsg}
            </p>
          )}
          {successMsg && (
            <p className="mt-4 text-sm text-green-600 bg-green-50 border border-green-200 rounded-lg p-3">
              {successMsg}
            </p>
          )}
          <button
            onClick={handleUpload}
            disabled={loading || !file}
            className="w-full mt-8 py-3 rounded-lg font-medium bg-black text-white hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
      </main>
    
    </>
  );
}
