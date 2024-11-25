import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
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
import { createUser } from "@/redux/store";
import { useState } from "react";

const loginSchema = z.object({
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
});

type LoginFormInputs = z.infer<typeof loginSchema>;

export function AddSellerDialog() {
  const dispatch = useAppDispatch();
  const { authenticate } = useAppState();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<LoginFormInputs>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      name: "",
      phone: "",
      email: "",
    },
  });

  const onSubmit = (values: LoginFormInputs) => {
    dispatch(createUser(values)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") setIsOpen(false);
      form.reset();
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add New Seller</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle>Add New Seller</DialogTitle>
          <DialogDescription>
            Note: The default password will be the same as the username.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 pt-4"
          >
            {/* <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                defaultValue="Pedro Duarte"
                className="col-span-3"
              />
            </div> */}
            {/* Email Field */}
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

            {/* Name Field */}
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

            {/* Phone Field */}
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

            {/* Email Field */}
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

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="secondary"
                  disabled={authenticate.isCreating}
                >
                  Close
                </Button>
              </DialogClose>
              <LoadingButton type="submit" isLoading={authenticate.isCreating}>
                Create
              </LoadingButton>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
