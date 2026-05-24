import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import { SiteHeader } from './components/SiteHeader';
import { SiteFooter } from './components/SiteFooter';
import { LuxuryShop } from './components/LuxuryShop';
import './styles.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex min-h-screen flex-col bg-background">
        <SiteHeader />
        <main className="flex-1">
          <LuxuryShop />
        </main>
        <SiteFooter />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
