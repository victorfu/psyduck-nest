import logo from "/logo.png";

export default function Logo({
  className,
  url,
}: {
  className?: string;
  url?: string;
}) {
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
