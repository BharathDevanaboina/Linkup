
import React from 'react';
import { FileCode, Terminal, AlertTriangle } from 'lucide-react';

export const SetupScreen = () => {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-6 font-sans">
      <div className="max-w-2xl w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center border border-yellow-500/50">
            <AlertTriangle className="w-6 h-6 text-yellow-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-white">Setup Required</h1>
            <p className="text-zinc-400">Connect your Firebase backend to continue.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-black border border-zinc-800 rounded-xl p-4">
            <h3 className="font-bold text-violet-400 mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4" /> Step 1: Get Keys
            </h3>
            <p className="text-sm text-zinc-400 mb-2">Run the setup command in your terminal or go to Firebase Console {'>'} Project Settings {'>'} General.</p>
          </div>

          <div className="bg-black border border-zinc-800 rounded-xl p-4">
            <h3 className="font-bold text-violet-400 mb-2 flex items-center gap-2">
              <FileCode className="w-4 h-4" /> Step 2: Update Code
            </h3>
            <p className="text-sm text-zinc-400 mb-4">
              Open the file <code className="bg-zinc-800 px-1 py-0.5 rounded text-white">firebase.ts</code> and replace the config object:
            </p>
            
            <div className="bg-zinc-900 p-4 rounded-lg overflow-x-auto border border-zinc-700">
              <pre className="text-xs text-green-400 font-mono">
{`const firebaseConfig = {
  apiKey: "AIzaSy...",          // <--- Paste Real Key
  authDomain: "...",            // <--- Paste Real Domain
  projectId: "...",             // <--- Paste Real ID
  // ... other fields
};`}
              </pre>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
            <p className="text-zinc-500 text-sm animate-pulse">Waiting for configuration...</p>
        </div>
      </div>
    </div>
  );
};
