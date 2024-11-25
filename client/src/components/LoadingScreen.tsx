import { FC } from "react";
import { LoaderCircleIcon } from "lucide-react";

interface LoadingScreenProps {}

export const LoadingScreen: FC<LoadingScreenProps> = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <LoaderCircleIcon className="animate-spin text-primary-500" size={80} />
    </div>
  );
};
