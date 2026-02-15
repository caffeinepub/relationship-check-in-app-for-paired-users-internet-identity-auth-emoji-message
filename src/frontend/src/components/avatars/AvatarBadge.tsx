import { getDisplayAvatar } from '../../features/profile/avatarUtils';

interface AvatarBadgeProps {
  avatar?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function AvatarBadge({ avatar, name, size = 'md', className = '' }: AvatarBadgeProps) {
  const displayAvatar = getDisplayAvatar(avatar, name);
  
  const sizeClasses = {
    sm: 'h-8 w-8 text-lg',
    md: 'h-10 w-10 text-xl',
    lg: 'h-12 w-12 text-2xl',
  };

  return (
    <div 
      className={`flex items-center justify-center rounded-full bg-primary/10 ${sizeClasses[size]} ${className}`}
      aria-label={`${name}'s avatar`}
    >
      {displayAvatar}
    </div>
  );
}
