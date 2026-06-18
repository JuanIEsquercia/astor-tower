"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, AlertTriangle } from "lucide-react";
import { isConfigured } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!isConfigured) {
        throw new Error("Firebase no está configurado.");
      }

      const { auth } = await import("@/lib/firebase");
      const { signInWithEmailAndPassword } = await import("firebase/auth");

      if (!auth) throw new Error("Firebase auth no disponible.");

      const credential = await signInWithEmailAndPassword(auth, email, password);
      const token = await credential.user.getIdToken();

      const res = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? "No se pudo crear la sesión en el servidor.");
      }

      router.push("/admin");
    } catch (err: unknown) {
      const code = (err as { code?: string }).code;
      if (code === "auth/invalid-credential" || code === "auth/user-not-found") {
        setError("Email o contraseña incorrectos.");
      } else if (code === "auth/too-many-requests") {
        setError("Demasiados intentos. Intente más tarde.");
      } else {
        setError((err as Error).message ?? "Error al iniciar sesión.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ backgroundColor: "#0A0A0A" }}
    >
      {/* Grid texture */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 80px, #fff 80px, #fff 81px), repeating-linear-gradient(90deg, transparent, transparent 80px, #fff 80px, #fff 81px)",
        }}
      />

      <div className="relative z-10 w-full max-w-md px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <p className="text-white/30 text-[10px] font-label uppercase tracking-[0.3em] mb-3">
            Panel de gestión
          </p>
          <h1
            className="text-white text-3xl tracking-tight"
            style={{ fontFamily: "var(--font-libre-caslon, serif)" }}
          >
            Astor Tower
          </h1>
        </div>

        {/* Firebase not configured notice */}
        {!isConfigured && (
          <div className="mb-6 rounded-xl p-4 flex gap-3 items-start"
            style={{ backgroundColor: "rgba(234, 179, 8, 0.1)", border: "1px solid rgba(234, 179, 8, 0.2)" }}
          >
            <AlertTriangle size={16} className="text-yellow-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-yellow-400 text-xs font-medium">Firebase no configurado</p>
              <p className="text-yellow-400/70 text-xs mt-0.5">
                Copie <code className="font-mono bg-yellow-400/10 px-1 rounded">.env.local.example</code> a{" "}
                <code className="font-mono bg-yellow-400/10 px-1 rounded">.env.local</code> y complete sus credenciales de Firebase.
              </p>
            </div>
          </div>
        )}

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{ backgroundColor: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <h2 className="text-white text-lg font-medium mb-6">Iniciar sesión</h2>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-white/40 text-xs font-label uppercase tracking-[0.1em]">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg px-4 py-3 text-sm text-white outline-none transition-colors"
                style={{
                  backgroundColor: "#1F1F1F",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
                onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
              />
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-white/40 text-xs font-label uppercase tracking-[0.1em]">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPass ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-lg px-4 py-3 pr-11 text-sm text-white outline-none transition-colors"
                  style={{
                    backgroundColor: "#1F1F1F",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)")}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
                />
                <button
                  type="button"
                  onClick={() => setShowPass((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading || !isConfigured}
              className="w-full py-3 rounded-lg text-sm font-medium transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#ffffff", color: "#0a0a0a" }}
            >
              {loading ? "Iniciando sesión..." : "Ingresar"}
            </button>
          </form>
        </div>

        <p className="text-center text-white/20 text-xs mt-6">
          Acceso exclusivo para administradores
        </p>
      </div>
    </div>
  );
}
