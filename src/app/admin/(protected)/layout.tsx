import { requireAuthPage } from '@/lib/auth';

export default async function ProtectedAdminLayout({ children }: { children: React.ReactNode }) {
  await requireAuthPage();
  return (
    <div className="min-h-screen bg-slate-900 font-body">
      <header className="bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏎️</span>
          <h1 className="text-white font-bold font-display">Grand Prix Admin</h1>
        </div>
        <div className="flex items-center gap-4">
          <a href="/display" className="text-slate-400 hover:text-white text-sm transition-colors">
            Ver display →
          </a>
          <form action="/api/auth/logout" method="POST">
            <button
              type="submit"
              className="text-slate-400 hover:text-red-400 text-sm transition-colors"
              formAction="/api/auth/logout"
            >
              Sair
            </button>
          </form>
        </div>
      </header>
      <main className="p-6">{children}</main>
    </div>
  );
}
