import React from "react";

export default function Footer() {
  return (
    <footer className="bg-[#1F1F33] text-center py-4 text-sm text-[#A5A5D6] border-t border-[#29293E]">
      © {new Date().getFullYear()} SereneCare App — Todos os direitos reservados.
    </footer>
  );
}
