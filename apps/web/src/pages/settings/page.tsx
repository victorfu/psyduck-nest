import { Separator } from "@/components/ui/separator";
import { SettingsForm } from "./settings-form";

function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Settings</h3>
        <p className="text-sm text-muted-foreground">Update your preferences</p>
      </div>
      <Separator />
      <SettingsForm />
    </div>
  );
}

export default SettingsPage;
