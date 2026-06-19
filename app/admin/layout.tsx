import { cookies } from "next/headers";
import Sidebar from "@/components/admin/Sidebar";

export const metadata = { title: "Admin — Astor Tower" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const rol = (cookieStore.get("astor-role")?.value ?? "usuario") as "superadmin" | "usuario";

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: "#F5F5F4", fontFamily: "var(--font-manrope, Manrope, sans-serif)" }}>
      <Sidebar rol={rol} />
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
