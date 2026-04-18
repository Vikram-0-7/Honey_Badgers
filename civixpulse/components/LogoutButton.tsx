"use client";

import { createClient } from "@/libs/supabase/client";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = await createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <button 
      onClick={handleLogout} 
      className="group flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-red-600 transition-opacity hover:opacity-70 ml-4"
    >
      <LogOut className="h-5 w-5" />
    </button>
  );
}
