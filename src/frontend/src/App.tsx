import { useInternetIdentity } from './hooks/useInternetIdentity';
import { useGetCallerUserProfile } from './features/profile/useGetCallerUserProfile';
import { ProfileSetupDialog } from './features/profile/ProfileSetupDialog';
import { LoginButton } from './components/auth/LoginButton';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardView } from './features/dashboard/DashboardView';
import { PairingCard } from './features/pairing/PairingCard';
import { usePairingStatus } from './features/pairing/usePairingStatus';
import { Loader2 } from 'lucide-react';

export default function App() {
  const { identity, isInitializing } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading, isFetched } = useGetCallerUserProfile();
  const { isPaired, isLoading: pairingLoading } = usePairingStatus();

  const isAuthenticated = !!identity;

  // Show loading state during initialization
  if (isInitializing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Not authenticated - show login screen
  if (!isAuthenticated) {
    return (
      <AppLayout showAuthButton={false}>
        <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              Welcome to HeartSync
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              Connect with your partner and share daily emotional check-ins
            </p>
          </div>
          <LoginButton />
        </div>
      </AppLayout>
    );
  }

  // Show profile setup if needed (prevent flash by checking isFetched)
  const showProfileSetup = isAuthenticated && !profileLoading && isFetched && userProfile === null;
  if (showProfileSetup) {
    return (
      <AppLayout>
        <ProfileSetupDialog open={true} />
      </AppLayout>
    );
  }

  // Show loading while checking pairing status
  if (profileLoading || pairingLoading) {
    return (
      <AppLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    );
  }

  // Not paired - show pairing screen
  if (!isPaired) {
    return (
      <AppLayout>
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Connect with Your Partner</h1>
            <p className="text-muted-foreground">
              Create an invite code or join using your partner's code
            </p>
          </div>
          <PairingCard />
        </div>
      </AppLayout>
    );
  }

  // Paired - show dashboard
  return (
    <AppLayout>
      <DashboardView />
    </AppLayout>
  );
}
