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
import { CountriesMapSelector } from '../country/CountriesMapSelector';
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
  
  const disconnectMutation = useDisconnectPartner();
  const { data: userProfile } = useGetCallerUserProfile();
  const saveProfileMutation = useSaveCallerUserProfile();

  const currentCountry = userProfile?.country;
  const currentCountryName = currentCountry ? getCountryByCode(currentCountry)?.name : 'Not set';

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

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your connection and preferences</p>
      </div>

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
                  className="flex-1 gap-2"
                >
                  {saveProfileMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Country
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

      <Card>
        <CardHeader>
          <CardTitle>Partner Connection</CardTitle>
          <CardDescription>Manage your partner connection settings</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={() => setShowConfirmDialog(true)}
            disabled={disconnectMutation.isPending}
            className="gap-2"
          >
            {disconnectMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <UserX className="h-4 w-4" />
                Remove Partner
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Partner Connection</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove your partner connection?
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
