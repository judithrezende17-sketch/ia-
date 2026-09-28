'use client';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white space-y-4 p-4 text-center">
      <h2 className="text-xl font-bold font-chess text-amber-400">Ocorreu um erro inesperado</h2>
      <p className="text-xs text-neutral-400">Não foi possível carregar o jogo solicitado.</p>
      <button
        onClick={() => reset()}
        className="px-5 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-xl text-xs uppercase tracking-wider font-chess transition-all"
      >
        Tentar Novamente
      </button>
    </div>
  );
}
