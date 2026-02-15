import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useDisconnectPartner } from '../pairing/useDisconnectPartner';
import { useGetCallerUserProfile } from '../profile/useGetCallerUserProfile';
import { useSaveCallerUserProfile } from '../profile/useSaveCallerUserProfile';
import { usePairingStatus } from '../pairing/usePairingStatus';
import { useRelationshipStatusState } from '../relationshipStatus/useRelationshipStatusState';
import { ChangeRelationshipStatusControl } from '../relationshipStatus/ChangeRelationshipStatusControl';
import { CountriesMapSelector } from '../country/CountriesMapSelector';
import { AvatarPicker } from '../profile/AvatarPicker';
import { getCountryByCode } from '../country/countries';
import { Loader2, UserX, Save } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsViewProps {
  onDisconnectSuccess: () => void;
}

export function SettingsView({ onDisconnectSuccess }: SettingsViewProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [editingCountry, setEditingCountry] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  const [editingAvatar, setEditingAvatar] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState<string>('');
  
  const disconnectMutation = useDisconnectPartner();
  const { data: userProfile } = useGetCallerUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();
  const { isPaired } = usePairingStatus();
  const { hasStatus, statusValue } = useRelationshipStatusState();

  const currentCountry = userProfile?.country;
  const currentCountryName = currentCountry ? getCountryByCode(currentCountry)?.name : 'Not set';
  const currentAvatar = userProfile?.avatar || '';

  const handleConfirmDisconnect = async () => {
    try {
      await disconnectMutation.mutateAsync();
      setShowConfirmDialog(false);
      toast.success('Partner removed successfully.');
      onDisconnectSuccess();
    } catch (error: any) {
      if (error.message?.includes('not currently paired')) {
        setShowConfirmDialog(false);
        toast.success('Partner removed successfully.');
        onDisconnectSuccess();
      } else {
        toast.error('Failed to remove partner. Please try again.');
      }
    }
  };

  const handleEditCountry = () => {
    setSelectedCountry(currentCountry || '');
    setEditingCountry(true);
  };

  const handleSaveCountry = async () => {
    if (!userProfile || !selectedCountry) {
      toast.error('Country selection is required.');
      return;
    }
    
    try {
      await saveProfileMutation.mutateAsync({
        name: userProfile.name,
        country: selectedCountry,
        avatar: currentAvatar,
      });
      toast.success('Country updated successfully.');
      setEditingCountry(false);
    } catch (error: any) {
      const errorMsg = error?.message?.includes('Country') 
        ? 'Country selection is required.' 
        : 'Failed to update country. Please try again.';
      toast.error(errorMsg);
    }
  };

  const handleCancelEdit = () => {
    setEditingCountry(false);
    setSelectedCountry('');
  };

  const handleEditAvatar = () => {
    setSelectedAvatar(currentAvatar);
    setEditingAvatar(true);
  };

  const handleSaveAvatar = async () => {
    if (!userProfile) {
      toast.error('Profile not found.');
      return;
    }
    
    try {
      await saveProfileMutation.mutateAsync({
        name: userProfile.name,
        country: userProfile.country,
        avatar: selectedAvatar,
      });
      toast.success('Avatar updated successfully.');
      setEditingAvatar(false);
    } catch (error: any) {
      toast.error('Failed to update avatar. Please try again.');
    }
  };

  const handleCancelAvatarEdit = () => {
    setEditingAvatar(false);
    setSelectedAvatar('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your connection and preferences</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Avatar</CardTitle>
          <CardDescription>Your profile avatar</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!editingAvatar ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
                  {currentAvatar || (userProfile?.name ? userProfile.name[0].toUpperCase() : '👤')}
                </div>
                <div>
                  <p className="font-medium">
                    {currentAvatar ? 'Custom avatar' : 'Default avatar'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {currentAvatar ? 'Using selected emoji' : 'Using first letter of name'}
                  </p>
                </div>
              </div>
              <Button onClick={handleEditAvatar} variant="outline">
                Edit
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <AvatarPicker
                value={selectedAvatar}
                onChange={setSelectedAvatar}
                userName={userProfile?.name || ''}
                disabled={saveProfileMutation.isPending}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveAvatar}
                  disabled={saveProfileMutation.isPending}
                  className="flex-1"
                >
                  {saveProfileMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancelAvatarEdit}
                  variant="outline"
                  disabled={saveProfileMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Country</CardTitle>
          <CardDescription>Your current location</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!editingCountry ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">{currentCountryName}</p>
                <p className="text-sm text-muted-foreground">
                  {currentCountry ? `Code: ${currentCountry}` : 'No country selected'}
                </p>
              </div>
              <Button onClick={handleEditCountry} variant="outline">
                Edit
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <CountriesMapSelector
                value={selectedCountry}
                onChange={setSelectedCountry}
                disabled={saveProfileMutation.isPending}
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSaveCountry}
                  disabled={!selectedCountry || saveProfileMutation.isPending}
                  className="flex-1"
                >
                  {saveProfileMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Save
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleCancelEdit}
                  variant="outline"
                  disabled={saveProfileMutation.isPending}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isPaired && hasStatus && statusValue && (
        <ChangeRelationshipStatusControl currentStatus={statusValue} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Partner Connection</CardTitle>
          <CardDescription>Manage your partner connection</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => setShowConfirmDialog(true)}
            disabled={disconnectMutation.isPending}
            className="w-full"
          >
            {disconnectMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing Partner...
              </>
            ) : (
              <>
                <UserX className="mr-2 h-4 w-4" />
                Remove Partner
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will disconnect you from your partner. You'll need to pair again to reconnect.
              All shared data will be reset.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDisconnect}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Remove Partner
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
