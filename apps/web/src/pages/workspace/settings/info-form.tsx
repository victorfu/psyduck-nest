import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { toast } from "@/components/ui/use-toast";
import Api from "@/lib/api";

const infoFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),
  description: z.string().optional(),
  manager: z.string().optional(),
});

type InfoFormValues = z.infer<typeof infoFormSchema>;

export function InfoForm({ workspace }: { workspace: Workspace }) {
  const defaultValues: Partial<InfoFormValues> = {
    name: workspace.name ?? "",
    description: workspace.description ?? "",
    manager: workspace.manager ?? "",
  };

  const form = useForm<InfoFormValues>({
    resolver: zodResolver(infoFormSchema),
    defaultValues,
  });

  async function onSubmit(data: InfoFormValues) {
    try {
      await Api.updateWorkspace(workspace.id, data);
      toast({
        title: "Workspace updated",
        description: "Your workspace has been updated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "An error occurred",
        description: "Unable to update workspace.",
        variant: "destructive",
      });
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Workspace name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="Workspace description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="manager"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Manager</FormLabel>
              <FormControl>
                <Input placeholder="Workspace manager" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update</Button>
      </form>
    </Form>
  );
}
