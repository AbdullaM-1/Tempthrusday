import { Id, toast, ToastContent, UpdateOptions } from "react-toastify";

const OPTIONS: UpdateOptions = {
  isLoading: false,
  autoClose: 3000,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const notify = {
  update: {
    success: (message: ToastContent, toastId: Id, options?: UpdateOptions) => {
      toast.update(toastId, {
        ...OPTIONS,
        ...options,
        type: "success",
        render: message,
      });
    },
    error: (message: ToastContent, toastId: Id, options?: UpdateOptions) => {
      toast.update(toastId, {
        ...OPTIONS,
        ...options,
        type: "error",
        render: message,
      });
    },
    info: (message: ToastContent, toastId: Id, options?: UpdateOptions) => {
      toast.update(toastId, {
        ...OPTIONS,
        ...options,
        type: "info",
        render: message,
      });
    },
    warning: (message: ToastContent, toastId: Id, options?: UpdateOptions) => {
      toast.update(toastId, {
        ...OPTIONS,
        ...options,
        type: "warning",
        render: message,
      });
    },
  },
};
