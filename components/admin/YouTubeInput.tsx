"use client";

import { useState, useEffect } from "react";
import { PlayCircle, X } from "lucide-react";

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export function parseYouTubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : null;
}

export function isYouTubeShort(url: string): boolean {
  return url.includes("/shorts/");
}

export default function YouTubeInput({ value, onChange }: Props) {
  const [draft, setDraft] = useState(value);
  const [error, setError] = useState("");

  useEffect(() => {
    setDraft(value);
  }, [value]);

  const handleBlur = () => {
    if (!draft.trim()) {
      onChange("");
      setError("");
      return;
    }
    const id = parseYouTubeId(draft.trim());
    if (!id) {
      setError("URL de YouTube no reconocida. Pegá el link del video o del Short.");
      return;
    }
    setError("");
    onChange(draft.trim());
  };

  const clear = () => {
    setDraft("");
    onChange("");
    setError("");
  };

  const id = parseYouTubeId(value);
  const isShort = isYouTubeShort(value);

  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400">
          <PlayCircle size={15} />
        </div>
        <input
          className="admin-input pl-8 pr-8"
          placeholder="https://youtube.com/watch?v=... o /shorts/..."
          value={draft}
          onChange={(e) => { setDraft(e.target.value); setError(""); }}
          onBlur={handleBlur}
        />
        {draft && (
          <button
            type="button"
            onClick={clear}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      {id && (
        <div className={`overflow-hidden rounded-xl border border-zinc-100 bg-zinc-900 ${isShort ? "max-w-[220px] aspect-[9/16]" : "aspect-video"}`}>
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            title="Vista previa"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full"
          />
        </div>
      )}
    </div>
  );
}
