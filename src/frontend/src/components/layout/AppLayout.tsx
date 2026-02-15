import { LoginButton } from '../auth/LoginButton';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { usePairingStatus } from '../../features/pairing/usePairingStatus';
import { useGetCallerUserProfile } from '../../features/profile/useGetCallerUserProfile';
import { useRelationshipStatusState } from '../../features/relationshipStatus/useRelationshipStatusState';
import { countryCodeToFlagEmoji } from '../../features/country/flagEmoji';
import { getRelationshipStatusColors } from '../../features/relationshipStatus/relationshipStatusColors';
import { AvatarBadge } from '../avatars/AvatarBadge';
import { Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Toaster } from '@/components/ui/sonner';

interface AppLayoutProps {
  children: React.ReactNode;
  showAuthButton?: boolean;
}

export function AppLayout({ children, showAuthButton = true }: AppLayoutProps) {
  const { identity } = useInternetIdentity();
  const { isPaired, partnerName, partnerCountry, partnerProfile } = usePairingStatus();
  const { data: userProfile } = useGetCallerUserProfile();
  const { relationshipStatus } = useRelationshipStatusState();
  
  const isAuthenticated = !!identity;
  const userCountry = userProfile?.country;

  // Show flags only when authenticated, paired, and both countries are set
  const showFlags = isAuthenticated && 
                    isPaired && 
                    userCountry && 
                    userCountry.trim() !== '' && 
                    partnerCountry && 
                    partnerCountry.trim() !== '';

  const userFlag = userCountry ? countryCodeToFlagEmoji(userCountry) : '';
  const partnerFlag = partnerCountry ? countryCodeToFlagEmoji(partnerCountry) : '';
  
  const heartColors = getRelationshipStatusColors(relationshipStatus?.status);

  // Show avatars when paired
  const showAvatars = isAuthenticated && isPaired && userProfile && partnerProfile;

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/30">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col gap-3">
            {/* Flags and Heart Row */}
            {showFlags && (
              <div className="flex items-center justify-center gap-3">
                <span className="text-4xl" role="img" aria-label="Your country flag">
                  {userFlag}
                </span>
                <Heart 
                  className={`h-6 w-6 ${heartColors.textColor} ${heartColors.fillColor}`}
                  aria-label="Relationship heart"
                />
                <span className="text-4xl" role="img" aria-label="Partner country flag">
                  {partnerFlag}
                </span>
              </div>
            )}

            {/* Avatars Row (when paired) */}
            {showAvatars && (
              <div className="flex items-center justify-center gap-4">
                <div className="flex flex-col items-center gap-1">
                  <AvatarBadge 
                    avatar={userProfile.avatar} 
                    name={userProfile.name}
                    size="lg"
                  />
                  <span className="text-xs text-muted-foreground">You</span>
                </div>
                <Heart className="h-5 w-5 text-primary/50" />
                <div className="flex flex-col items-center gap-1">
                  <AvatarBadge 
                    avatar={partnerProfile.avatar} 
                    name={partnerProfile.name}
                    size="lg"
                  />
                  <span className="text-xs text-muted-foreground">{partnerProfile.name}</span>
                </div>
              </div>
            )}

            {/* Brand and Auth Row */}
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
