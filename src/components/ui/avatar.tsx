import { useState } from 'react';
import defaultAvatar from '@/assets/images/default-avatar.svg';

interface AvatarProps {
  src?: string | null;
  alt: string;
  className?: string;
}

export function Avatar({ src, alt, className = '' }: AvatarProps) {
  const [error, setError] = useState(false);
  
  return (
    <div className={`relative h-10 w-10 ${className}`}>
      <img
        src={error || !src ? defaultAvatar : src}
        alt={alt}
        className="h-full w-full rounded-full object-cover"
        onError={() => setError(true)}
      />
    </div>
  );
}
