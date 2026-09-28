export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-white space-y-3">
      <div className="text-4xl">♟️</div>
      <h1 className="text-xl font-bold font-chess text-amber-400">404 - Página Não Encontrada</h1>
      <a href="/" className="text-xs text-neutral-400 hover:text-white underline">
        Voltar para a Arena de Jogos
      </a>
    </div>
  );
}
