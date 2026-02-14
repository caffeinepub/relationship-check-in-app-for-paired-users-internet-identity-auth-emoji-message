import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { useInviteToken } from './useInviteToken';
import { useJoinWithToken } from './useJoinWithToken';
import { Copy, Check, Loader2, UserPlus, Link2 } from 'lucide-react';

export function PairingCard() {
  const [joinToken, setJoinToken] = useState('');
  const [copied, setCopied] = useState(false);
  const { token, generateToken, isGenerating, error: generateError } = useInviteToken();
  const { joinWithToken, isJoining, error: joinError } = useJoinWithToken();

  const handleCopy = async () => {
    if (token) {
      await navigator.clipboard.writeText(token);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleJoin = () => {
    if (joinToken.trim()) {
      joinWithToken(joinToken.trim());
    }
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5 text-primary" />
            Create Invite Code
          </CardTitle>
          <CardDescription>
            Generate a code for your partner to connect with you
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!token ? (
            <Button
              onClick={generateToken}
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Invite Code'
              )}
            </Button>
          ) : (
            <div className="space-y-3">
              <div className="space-y-2">
                <Label>Your Invite Code</Label>
                <div className="flex gap-2">
                  <Input
                    value={token}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={handleCopy}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Share this code with your partner so they can connect with you
              </p>
            </div>
          )}
          {generateError && (
            <p className="text-sm text-destructive">{generateError}</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Join with Code
          </CardTitle>
          <CardDescription>
            Enter your partner's invite code to connect
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="joinToken">Invite Code</Label>
            <Input
              id="joinToken"
              placeholder="Paste invite code here"
              value={joinToken}
              onChange={(e) => setJoinToken(e.target.value)}
              disabled={isJoining}
              className="font-mono"
            />
          </div>
          <Button
            onClick={handleJoin}
            disabled={!joinToken.trim() || isJoining}
            className="w-full"
          >
            {isJoining ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect with Partner'
            )}
          </Button>
          {joinError && (
            <p className="text-sm text-destructive">{joinError}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
