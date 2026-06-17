"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";

interface Props {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export default function ImageUpload({ images, onChange, maxImages = 5 }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const remaining = maxImages - images.length;

  const upload = async (files: FileList) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !preset) {
      setError("Cloudinary no configurado. Complete las variables en .env.local.");
      return;
    }

    if (remaining <= 0) {
      setError(`Límite de ${maxImages} imágenes alcanzado.`);
      return;
    }

    setUploading(true);
    setError("");

    const filesToUpload = Array.from(files).slice(0, remaining);
    if (files.length > remaining) {
      setError(`Solo se subirán ${remaining} imagen${remaining !== 1 ? "es" : ""} (límite: ${maxImages}).`);
    }

    const newUrls: string[] = [];

    for (const file of filesToUpload) {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", preset);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        { method: "POST", body: formData }
      );

      if (!res.ok) {
        setError("Error al subir una o más imágenes.");
        continue;
      }

      const data = await res.json();
      newUrls.push(data.secure_url);
    }

    onChange([...images, ...newUrls]);
    setUploading(false);
  };

  const remove = (url: string) => {
    onChange(images.filter((img) => img !== url));
  };

  return (
    <div className="space-y-3">
      {images.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((url) => (
            <div
              key={url}
              className="relative aspect-video rounded-lg overflow-hidden group border border-zinc-100"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => remove(url)}
                className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/60 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/80"
              >
                <X size={13} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div
        role="button"
        tabIndex={remaining > 0 ? 0 : -1}
        aria-disabled={remaining <= 0}
        className={`border-2 border-dashed rounded-xl p-8 text-center transition-all ${
          remaining <= 0
            ? "border-zinc-100 bg-zinc-50 cursor-not-allowed opacity-50"
            : "border-zinc-200 cursor-pointer hover:border-zinc-400 hover:bg-zinc-50"
        }`}
        onClick={() => remaining > 0 && inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && remaining > 0 && inputRef.current?.click()}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 size={20} className="text-zinc-400 animate-spin" />
            <p className="text-sm text-zinc-500">Subiendo imágenes...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <Upload size={20} className="text-zinc-400" />
            <p className="text-sm text-zinc-600 font-medium">
              {remaining <= 0 ? "Límite alcanzado" : "Subir imágenes"}
            </p>
            <p className="text-xs text-zinc-400">
              {remaining <= 0
                ? `Máximo ${maxImages} imágenes por tipología`
                : `JPG, PNG o WEBP · ${images.length}/${maxImages} imágenes`}
            </p>
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && upload(e.target.files)}
      />
    </div>
  );
}
