import { LoginButton } from '../auth/LoginButton';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { usePairingStatus } from '../../features/pairing/usePairingStatus';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

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
            <p>
              © {new Date().getFullYear()} HeartSync. Built with{' '}
              <Heart className="inline h-3 w-3 text-primary fill-primary" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                  typeof window !== 'undefined' ? window.location.hostname : 'heartsync-app'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-foreground hover:text-primary transition-colors"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
