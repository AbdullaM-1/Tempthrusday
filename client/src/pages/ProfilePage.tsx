import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil } from "lucide-react";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Input,
  LoadingButton,
  ConnectGoogleButton,
} from "@/components";
import { useAppDispatch, useAppState } from "@/hooks";
import { updateProfile } from "@/redux/store";
import { getFirstLetterOfUserName } from "@/utils";

interface ProfilePageProps {}

const profileSchema = z
  .object({
    name: z.string().trim().min(1, { message: "Name is required" }),
    phone: z.string().trim().min(1, { message: "Phone is required" }),
    address: z.string().trim().min(1, { message: "Address is required" }),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    oldPassword: z
      .string()
      .trim()
      .min(1, { message: "Old password is required" }),
  })
  .refine(
    (data) => {
      if (data.password) {
        return data.confirmPassword && data.password === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords must match",
      path: ["confirmPassword"],
    }
  )
  .refine(
    (data) => {
      if (data.password) {
        return data.password !== data.oldPassword;
      }
      return true;
    },
    {
      message: "New password must not be the same as old password",
      path: ["password"],
    }
  );

type ProfileFormInputs = z.infer<typeof profileSchema>;

export const ProfilePage: FC<ProfilePageProps> = () => {
  const { authenticate } = useAppState();
  const dispatch = useAppDispatch();
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const form = useForm<ProfileFormInputs>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: authenticate.user?.name,
      phone: authenticate.user?.phone,
      address: authenticate.user?.address,
      password: "",
      confirmPassword: "",
      oldPassword: "",
    },
  });

  const onSubmit = (values: ProfileFormInputs) => {
    dispatch(updateProfile({ ...values, avatar: selectedAvatar }));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedAvatar(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Sellers</h1>
        {authenticate.user?.role === "ADMIN" && <ConnectGoogleButton />}
      </div>
      <div className="mt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            {/* Avatar Field */}
            <div className="flex justify-center mt-8">
              <div className="relative">
                <Avatar className="w-52 h-52">
                  <AvatarImage
                    src={
                      avatarPreview ||
                      `${import.meta.env.VITE_APP_BASE_URL}/api/${
                        authenticate.user?.avatar
                      }`
                    }
                  />
                  <AvatarFallback>
                    <span className="text-5xl">
                      {getFirstLetterOfUserName(authenticate.user?.name!)}
                    </span>
                  </AvatarFallback>
                </Avatar>
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 bg-white p-2 rounded-full cursor-pointer"
                >
                  <Pencil size={20} />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  //   accept="image/png,image/jpeg,image/svg+xml"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
              {/* Username Field */}
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input
                    value={authenticate.user?.username}
                    type="text"
                    placeholder="Enter your username"
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              {/* Name Field */}
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your phone"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    value={authenticate.user?.email}
                    type="email"
                    placeholder="Enter your email"
                    readOnly
                  />
                </FormControl>
                <FormMessage />
              </FormItem>

              {/* Address Field */}
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your address"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter new password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Password Field */}
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Confirm new password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Old Password Field */}
              <FormField
                name="oldPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Old Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter old password"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="text-right mt-4">
              {/* Submit Button */}
              <LoadingButton
                type="submit"
                isLoading={authenticate.isUpdateLoading}
              >
                Upadate Profile
              </LoadingButton>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};
