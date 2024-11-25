import { LoaderCircleIcon } from "lucide-react";
import { FC, useRef, useState, useLayoutEffect } from "react";
import { Button, ButtonProps } from "@/components";

interface LoadingButtonProps extends ButtonProps {
  isLoading?: boolean;
}

export const LoadingButton: FC<LoadingButtonProps> = (props) => {
  const { isLoading, disabled, style, children, ...restOfProps } = props;
  const [buttonWidth, setButtonWidth] = useState<number | undefined>(undefined);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const buttonWidthStyle =
    isLoading && buttonWidth ? { minWidth: buttonWidth } : undefined;

  useLayoutEffect(() => {
    if (buttonRef.current) {
      setButtonWidth(buttonRef.current.offsetWidth);
    }
  }, []);

  return (
    <Button
      {...restOfProps}
      ref={buttonRef}
      style={{ ...style, ...buttonWidthStyle }}
      disabled={disabled ?? isLoading}
    >
      {isLoading ? <LoaderCircleIcon className="animate-spin" /> : children}
    </Button>
  );
};
