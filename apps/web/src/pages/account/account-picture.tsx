import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { toBase64 } from "@/lib/utils";
import { ChangeEvent, useState } from "react";

function AccountPicture({
  value,
  fallback,
  onChange,
}: {
  value?: string;
  fallback?: string;
  onChange?: (file: File) => void;
}) {
  const [src, setSrc] = useState<string | undefined>(value);

  async function handleOnChange(
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> {
    event.preventDefault();
    const file = event.target.files?.[0];
    if (!file) return;
    const base64 = await toBase64(file);
    setSrc(base64 as string);

    if (onChange) {
      onChange(file);
    }
  }

  return (
    <div className="relative">
      <Avatar className="w-24 h-24">
        <AvatarImage src={src} />
        <AvatarFallback>{fallback}</AvatarFallback>
      </Avatar>
      <Input
        type="file"
        className="absolute top-0 left-0 w-24 h-24 opacity-0 cursor-pointer"
        onChange={handleOnChange}
        accept="image/*"
      />
    </div>
  );
}

export default AccountPicture;
