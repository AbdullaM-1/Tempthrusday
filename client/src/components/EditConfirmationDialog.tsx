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
import { fetchConfirmation, updateConfirmation } from "@/redux/store";
import { FC, useEffect } from "react";
import { LoaderCircleIcon } from "lucide-react";
const updateConfirmationSchema = z.object({
  code: z.string().trim().min(1, { message: "Code is required" }),
});

type EditConfirmationFormInputs = z.infer<typeof updateConfirmationSchema>;

interface EditConfirmationDialogProps {
  confirmationId: string | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
}

export const EditConfirmationDialog: FC<EditConfirmationDialogProps> = ({
  confirmationId,
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const dispatch = useAppDispatch();
  const { confirmations } = useAppState();

  const form = useForm<EditConfirmationFormInputs>({
    resolver: zodResolver(updateConfirmationSchema),
    defaultValues: {
      code: "",
    },
  });

  useEffect(() => {
    if (isDialogOpen && confirmationId) {
      dispatch(fetchConfirmation(confirmationId)).then(
        ({ payload, meta }: any) => {
          const data = payload.data;
          if (meta.requestStatus === "fulfilled") {
            form.reset({
              code: data.code,
            });
          } else {
            setIsDialogOpen(false);
            form.reset();
          }
        }
      );
    }
  }, [isDialogOpen, confirmationId]);

  const onSubmit = (values: EditConfirmationFormInputs) => {
    if (!confirmationId) return;
    dispatch(updateConfirmation({ ...values, _id: confirmationId })).then(
      (res) => {
        if (res.meta.requestStatus === "fulfilled") {
          setIsDialogOpen(false);
          form.reset();
        }
      }
    );
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Update Confirmation</DialogTitle>
          <DialogDescription>
            Update confirmation details below.
          </DialogDescription>
        </DialogHeader>
        {confirmations.isLoading ? (
          <div className="flex justify-center items-center p-4">
            <LoaderCircleIcon
              className="animate-spin text-primary-500"
              size={32}
            />
          </div>
        ) : confirmations.foundConfirmation ? (
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
                    disabled={confirmations.isUpdateLoading}
                  >
                    Close
                  </Button>
                </DialogClose>
                <LoadingButton
                  type="submit"
                  isLoading={confirmations.isUpdateLoading}
                >
                  Update
                </LoadingButton>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <div className="flex justify-center items-center p-4 text-gray-500">
            No data available.
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
