'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';
import { DollarRateProvider } from '@/contexts/DollarRateContext';
import { TooltipProvider } from '@/components/ui/tooltip';
import { Toaster } from '@/components/ui/toaster';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DollarRateProvider>
        <TooltipProvider>
          {children}
          <Toaster />
        </TooltipProvider>
      </DollarRateProvider>
    </QueryClientProvider>
  );
}




