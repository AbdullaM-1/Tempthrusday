import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  Input,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  LoadingButton,
} from "@/components";
import { useAppDispatch, useAppState } from "@/hooks";
import { createConfirmation } from "@/redux/store";
import { useState } from "react";

const confirmationSchema = z.object({
  code: z.string().trim().min(1, { message: "Confirmation is required" }),
});

type ConfirmationFormInputs = z.infer<typeof confirmationSchema>;

export function AddConfirmationDialog() {
  const dispatch = useAppDispatch();
  const { authenticate, confirmations } = useAppState();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<ConfirmationFormInputs>({
    resolver: zodResolver(confirmationSchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = (values: ConfirmationFormInputs) => {
    dispatch(createConfirmation(values)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setIsOpen(false);
        form.reset();
      }
    });
  };

  return (
    authenticate.user?.role === "USER" && (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <Button>Add Confirmation</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[450px]">
          <DialogHeader>
            <DialogTitle>Add New Confirmation</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 pt-4"
            >
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid items-center gap-4 space-y-0">
                    <FormLabel>Confirmation String</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter confirmation string"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={confirmations.isCreating}
                  >
                    Close
                  </Button>
                </DialogClose>
                <LoadingButton
                  type="submit"
                  isLoading={confirmations.isCreating}
                >
                  Create
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    )
  );
}
