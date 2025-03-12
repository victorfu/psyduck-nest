import logo from "/logo.png";

export default function Logo({ className }: { className?: string }) {
  return <img src={logo} alt="psyduck" className={className} />;
}
