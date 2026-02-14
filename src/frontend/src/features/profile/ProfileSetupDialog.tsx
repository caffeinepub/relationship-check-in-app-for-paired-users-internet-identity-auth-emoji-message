import { useState } from 'react';
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
import { useSaveCallerUserProfile } from './useSaveCallerUserProfile';

interface ProfileSetupDialogProps {
  open: boolean;
}

export function ProfileSetupDialog({ open }: ProfileSetupDialogProps) {
  const [name, setName] = useState('');
  const [country, setCountry] = useState<string>('');
  const saveMutation = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && country) {
      saveMutation.mutate({ name: name.trim(), country });
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent 
        className="sm:max-w-2xl max-h-[90vh] overflow-y-auto" 
        onInteractOutside={(e) => e.preventDefault()}
      >
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Welcome to HeartSync</DialogTitle>
            <DialogDescription>
              Let's get started by setting up your profile.
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
                autoFocus
              />
            </div>

            <CountriesMapSelector
              value={country}
              onChange={setCountry}
              disabled={saveMutation.isPending}
            />

            {saveMutation.isError && (
              <p className="text-sm text-destructive">
                Failed to save profile. Please try again.
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
