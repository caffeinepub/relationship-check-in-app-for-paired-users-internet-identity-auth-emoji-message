import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { CountriesMapSelector } from '../country/CountriesMapSelector';
import { AvatarPicker } from './AvatarPicker';
import { useSaveCallerUserProfile } from './useSaveCallerUserProfile';
import { useGetCallerUserProfile } from './useGetCallerUserProfile';

interface ProfileSetupDialogProps {
  open: boolean;
}

export function ProfileSetupDialog({ open }: ProfileSetupDialogProps) {
  const { data: existingProfile } = useGetCallerUserProfile();
  const [name, setName] = useState('');
  const [country, setCountry] = useState<string>('');
  const [avatar, setAvatar] = useState<string>('');
  const saveMutation = useSaveCallerUserProfile();

  // Prefill fields if profile exists but country is missing
  useEffect(() => {
    if (existingProfile) {
      setName(existingProfile.name || '');
      setCountry(existingProfile.country || '');
      setAvatar(existingProfile.avatar || '');
    }
  }, [existingProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && country) {
      saveMutation.mutate({ name: name.trim(), country, avatar });
    }
  };

  const errorMessage = saveMutation.isError 
    ? (saveMutation.error as Error)?.message?.includes('Country')
      ? 'Country selection is required.'
      : 'Failed to save profile. Please try again.'
    : null;

  return (
    <Dialog open={open}>
      <DialogContent 
        className="sm:max-w-md max-h-[90vh] overflow-y-auto" 
        onInteractOutside={(e) => e.preventDefault()}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {existingProfile?.name ? 'Complete Your Profile' : 'Welcome to HeartSync'}
            </DialogTitle>
            <DialogDescription>
              {existingProfile?.name 
                ? 'Please select your country to continue.' 
                : "Let's get started by setting up your profile."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={saveMutation.isPending}
                autoFocus={!existingProfile?.name}
              />
            </div>

            <AvatarPicker
              value={avatar}
              onChange={setAvatar}
              userName={name}
              disabled={saveMutation.isPending}
            />

            <CountriesMapSelector
              value={country}
              onChange={setCountry}
              disabled={saveMutation.isPending}
            />

            {errorMessage && (
              <p className="text-sm text-destructive">
                {errorMessage}
              </p>
            )}
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={!name.trim() || !country || saveMutation.isPending}
              className="w-full"
            >
              {saveMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Continue'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
