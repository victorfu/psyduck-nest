import { useVersion } from "@/hooks/user-version";

function SettingsPage() {
  const version = useVersion();

  return (
    <div>
      <div>Version: {version}</div>
    </div>
  );
}

export default SettingsPage;
