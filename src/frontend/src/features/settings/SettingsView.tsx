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
import { Loader2, UserX } from 'lucide-react';
import { toast } from 'sonner';

interface SettingsViewProps {
  onDisconnectSuccess: () => void;
}

export function SettingsView({ onDisconnectSuccess }: SettingsViewProps) {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const disconnectMutation = useDisconnectPartner();

  const handleConfirmDisconnect = async () => {
    try {
      await disconnectMutation.mutateAsync();
      setShowConfirmDialog(false);
      toast.success('Partner removed successfully.');
      onDisconnectSuccess();
    } catch (error: any) {
      // Handle already disconnected case gracefully
      if (error.message?.includes('not currently paired')) {
        setShowConfirmDialog(false);
        toast.success('Partner removed successfully.');
        onDisconnectSuccess();
      } else {
        toast.error('Failed to remove partner. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your connection and preferences</p>
      </div>

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
