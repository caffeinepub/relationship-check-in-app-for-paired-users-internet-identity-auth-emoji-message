import { LoginButton } from '../auth/LoginButton';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { usePairingStatus } from '../../features/pairing/usePairingStatus';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/sonner';

interface AppLayoutProps {
  children: React.ReactNode;
  showAuthButton?: boolean;
}

export function AppLayout({ children, showAuthButton = true }: AppLayoutProps) {
  const { identity } = useInternetIdentity();
  const { isPaired, partnerName } = usePairingStatus();
  const isAuthenticated = !!identity;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                <Heart className="h-5 w-5 text-primary fill-primary" />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">HeartSync</h1>
                {isAuthenticated && isPaired && partnerName && (
                  <Badge variant="secondary" className="text-xs mt-0.5">
                    Connected with {partnerName}
                  </Badge>
                )}
              </div>
            </div>
            {showAuthButton && <LoginButton />}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-border/40 bg-card/30 mt-16">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>Created by Angelica Arboleda</p>
          </div>
        </div>
      </footer>

      <Toaster />
    </div>
  );
}
