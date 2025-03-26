export function Logo({ className, url }: { className?: string; url?: string }) {
  if (url) {
    return <img src={url} alt="psyduck" className={className} />;
  }

  return (
    <div className={className}>
      <span className="text-xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-transparent bg-clip-text">
        DUCK
      </span>
    </div>
  );
}

export function SingleTextLogo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <span className="text-center text-2xl font-bold bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-transparent bg-clip-text">
        D
      </span>
    </div>
  );
}
