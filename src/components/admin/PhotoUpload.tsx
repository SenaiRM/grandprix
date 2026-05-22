'use client';

import { useRef, useState } from 'react';

interface PhotoUploadProps {
  value: string | null;
  onChange: (url: string) => void;
  label: string;
}

export default function PhotoUpload({ value, onChange, label }: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) { setError('Apenas imagens'); return; }
    if (file.size > 2 * 1024 * 1024) { setError('Máx 2 MB'); return; }
    setError('');
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      const res = await fetch('/api/upload', { method: 'POST', body: form });

      let data: { url?: string; error?: string } = {};
      try {
        data = await res.json();
      } catch {
        throw new Error('Erro no servidor — verifique as credenciais do Cloudinary nas variáveis do Railway');
      }

      if (!res.ok) throw new Error(data.error ?? 'Erro no upload');
      if (data.url) onChange(data.url);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro no upload');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-slate-300">{label} <span className="text-slate-500 text-xs">(opcional)</span></span>
      <div
        className="flex items-center gap-3 p-2 rounded-lg border border-slate-600 bg-slate-800 cursor-pointer hover:border-orange-500 transition-colors"
        onClick={() => inputRef.current?.click()}
      >
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-500 flex-shrink-0 bg-slate-700 flex items-center justify-center">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="foto" className="w-full h-full object-cover" />
          ) : (
            <span className="text-xl">👤</span>
          )}
        </div>
        <div className="flex-1 min-w-0">
          {uploading ? (
            <span className="text-sm text-orange-400">Enviando...</span>
          ) : value ? (
            <span className="text-sm text-green-400 truncate block">Foto carregada ✓</span>
          ) : (
            <span className="text-sm text-slate-400">Clique para enviar foto</span>
          )}
        </div>
        {value && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onChange(''); }}
            className="text-slate-500 hover:text-red-400 text-lg leading-none flex-shrink-0 px-1"
            title="Remover foto"
          >
            ✕
          </button>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-400 leading-snug">{error}</span>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }}
      />
    </div>
  );
}
