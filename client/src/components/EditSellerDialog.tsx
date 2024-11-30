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
import { updateUser, fetchUser } from "@/redux/store";
import { FC, useEffect } from "react";
import { LoaderCircleIcon } from "lucide-react";
const updateSellerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: "Username is required" })
    .refine((val) => !/\.\./.test(val), {
      message: "Username must not contain consecutive dots.",
    })
    .refine((val) => !/\.$/.test(val), {
      message: "Username must not end with a dot.",
    })
    .refine((val) => val.length <= 30, {
      message: "Username must be at most 30 characters long.",
    })
    .refine((val) => /^[a-zA-Z0-9_.]+$/.test(val), {
      message:
        "Username can only contain letters, numbers, underscores, and dots.",
    })
    .refine((val) => /^[^\W]/.test(val), {
      message: "Username must start with a letter or number.",
    }),
  name: z.string().trim().min(1, { message: "Name is required" }),
  phone: z.string().trim().min(1, { message: "Phone is required" }),
  email: z.string().trim().email().min(1, { message: "Email is required" }),
  commission: z.number().int().min(0).max(100),
});

type EditSellerFormInputs = z.infer<typeof updateSellerSchema>;

interface EditSellerDialogProps {
  sellerId: string | null;
  isDialogOpen: boolean;
  setIsDialogOpen: (isDialogOpen: boolean) => void;
}

export const EditSellerDialog: FC<EditSellerDialogProps> = ({
  sellerId,
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const dispatch = useAppDispatch();
  const { authenticate } = useAppState();

  const form = useForm<EditSellerFormInputs>({
    resolver: zodResolver(updateSellerSchema),
    defaultValues: {
      username: "",
      name: "",
      phone: "",
      email: "",
    },
  });

  useEffect(() => {
    if (isDialogOpen && sellerId) {
      dispatch(fetchUser(sellerId)).then(({ payload, meta }: any) => {
        const data = payload.data;
        if (meta.requestStatus === "fulfilled") {
          form.reset({
            username: data.username || "",
            name: data.name || "",
            phone: data.phone || "",
            email: data.email || "",
          });
        } else {
          setIsDialogOpen(false);
          form.reset();
        }
      });
    }
  }, [isDialogOpen, sellerId]);

  const onSubmit = (values: EditSellerFormInputs) => {
    if (!sellerId) return;
    dispatch(updateUser({ ...values, _id: sellerId })).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        setIsDialogOpen(false);
        form.reset();
      }
    });
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Update Seller</DialogTitle>
          <DialogDescription>Update seller details below.</DialogDescription>
        </DialogHeader>
        {authenticate.isLoading ? (
          <div className="flex justify-center items-center p-4">
            <LoaderCircleIcon
              className="animate-spin text-primary-500"
              size={32}
            />
          </div>
        ) : authenticate.foundUser ? (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-4 pt-4"
            >
              <FormField
                name="username"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                    <FormLabel className="text-right">Username</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter username"
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                    <FormLabel className="text-right">Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter name"
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />
              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                    <FormLabel className="text-right">Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter phone"
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                    <FormLabel className="text-right">Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter email"
                        className="col-span-3"
                      />
                    </FormControl>
                    <FormMessage className="col-span-4" />
                  </FormItem>
                )}
                />

                <FormField
                  name="commission"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4 space-y-0">
                      <FormLabel className="text-right">Commission</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="number"
                          placeholder="Enter commission"
                          className="col-span-3"
                          onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
                        />
                      </FormControl>
                      <FormMessage className="col-span-4" />
                    </FormItem>
                  )}
                />
                
              <DialogFooter className="pt-4">
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    disabled={authenticate.isUpdateLoading}
                  >
                    Close
                  </Button>
                </DialogClose>
                <LoadingButton
                  type="submit"
                  isLoading={authenticate.isUpdateLoading}
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
