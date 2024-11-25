import { FC } from "react";
import { Slide, ToastContainer } from "react-toastify";
import { useResize } from "@/hooks";
import "react-toastify/dist/ReactToastify.css";

export const NotificationContainer: FC = () => {
  const viewWidth = useResize();
  const isBelowDesktop = viewWidth < 1200;

  return (
    <ToastContainer
      position={isBelowDesktop ? "top-center" : "bottom-right"}
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      pauseOnHover
      theme="colored"
      transition={Slide}
    />
  );
};
