"use client";

import { useTransition } from "react";
import LoadingSpinner from "./loading-spinner";
import { Switch } from "@/components/ui/switch";
import { useToast } from "./use-toast";

export const AdminSwitch = ({
  uid,
  isAdmin,
}: {
  uid: string;
  isAdmin: boolean;
}) => {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  return (
    <>
      {isPending && <LoadingSpinner fullpage={true} />}
      <Switch
        checked={isAdmin}
        onCheckedChange={() => {
          startTransition(() => {
            // TODO: toggle admin status
            console.log("TODO: toggle admin status");
            toast({
              title: "Admin status updated",
              description: `User ${uid} admin status has been updated.`,
            });
          });
        }}
      />
    </>
  );
};
