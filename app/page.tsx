'use client';

import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';

const App = dynamic(() => import('../src/App'), {
  ssr: false,
});

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full bg-neutral-950 flex flex-col items-center justify-center space-y-3">
          <div className="text-4xl animate-bounce">♟️</div>
          <p className="text-sm font-bold text-amber-400 font-mono tracking-wider">Carregando Arena de Jogos...</p>
        </div>
      }
    >
      <App />
    </Suspense>
  );
}
