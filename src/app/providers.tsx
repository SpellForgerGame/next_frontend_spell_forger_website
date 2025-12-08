'use client'; // 👈 Obrigatório para Contextos funcionarem

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";

export function Providers({ children }: { children: React.ReactNode }) {
  // Criamos o cliente dentro do componente para evitar erros no Next.js
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}