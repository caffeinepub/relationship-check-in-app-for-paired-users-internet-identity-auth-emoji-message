import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AVATAR_PRESETS, getDisplayAvatar } from './avatarUtils';
import { X } from 'lucide-react';

interface AvatarPickerProps {
  value: string;
  onChange: (avatar: string) => void;
  userName: string;
  disabled?: boolean;
}

export function AvatarPicker({ value, onChange, userName, disabled }: AvatarPickerProps) {
  const [open, setOpen] = useState(false);
  
  const displayAvatar = getDisplayAvatar(value, userName);
  const hasCustomAvatar = value && value.trim() !== '';

  const handleSelect = (emoji: string) => {
    onChange(emoji);
    setOpen(false);
  };

  const handleClear = () => {
    onChange('');
    setOpen(false);
  };

  return (
    <div className="space-y-2">
      <Label>Avatar</Label>
      <div className="flex items-center gap-3">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
          {displayAvatar}
        </div>
        <div className="flex-1 space-y-2">
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                disabled={disabled}
                className="w-full"
              >
                Choose Avatar
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="start">
              <div className="flex items-center justify-between border-b p-3">
                <p className="text-sm font-medium">Select an avatar</p>
                {hasCustomAvatar && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleClear}
                    className="h-8 px-2"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear
                  </Button>
                )}
              </div>
              <ScrollArea className="h-64">
                <div className="grid grid-cols-6 gap-2 p-3">
                  {AVATAR_PRESETS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => handleSelect(emoji)}
                      className={`flex h-12 w-12 items-center justify-center rounded-lg text-2xl transition-colors hover:bg-accent ${
                        value === emoji ? 'bg-accent ring-2 ring-primary' : ''
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </PopoverContent>
          </Popover>
          <p className="text-xs text-muted-foreground">
            {hasCustomAvatar ? 'Custom avatar selected' : 'Using default avatar'}
          </p>
        </div>
      </div>
    </div>
  );
}
