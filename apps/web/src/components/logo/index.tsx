import logo from "/logo.png";

export default function Logo({
  className,
  url,
}: {
  className?: string;
  url?: string;
}) {
  return <img src={url || logo} alt="psyduck" className={className} />;
}
