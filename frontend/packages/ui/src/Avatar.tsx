interface AvatarProps {
  src?: string;
  handle: string;
  size?: number;
}

export function Avatar({ src, handle, size = 96 }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={`@${handle}`}
        className="xstore__avatar"
        style={{ width: size, height: size }}
        loading="eager"
      />
    );
  }

  return (
    <div
      className="xstore__avatar xstore__avatar--placeholder"
      style={{ width: size, height: size }}
      aria-label={`@${handle}`}
    >
      {handle.charAt(0).toUpperCase()}
    </div>
  );
}
