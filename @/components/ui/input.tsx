import * as React from "react";
import { cn } from "../../lib/utils";
import errorIcon from "../../../public/imgs/Error.svg";
import successIcon from "../../../public/imgs/Success.svg";
import Image from "next/image";
import { Button } from "../ui/button";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  isSuccess?: boolean;
  getCode?: boolean;
  confirm?: boolean;
  confirmButton?: boolean;
  setConfirm?: (value: boolean) => void;
  onGetCodeClick?: () => void; // Add this line
}

const BaseInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      hasError,
      isSuccess,
      getCode,
      confirm,
      setConfirm,
      confirmButton,
      onGetCodeClick, // Add this
      ...props
    },
    ref
  ) => {
    return (
      <div className="relative flex items-center ">
        <input
          type={type}
          className={cn(
            "h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inputFocusBeta disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        {hasError && (
          <div className="absolute right-4 top-3">
            <Image src={errorIcon} alt="Error Icon" width={24} height={24} />
          </div>
        )}
        {isSuccess && (
          <div className="absolute right-4 top-3">
            <Image
              src={successIcon}
              alt="Success Icon"
              width={24}
              height={24}
            />
          </div>
        )}
        {getCode && (
          <div className="absolute right-4">
            <Button
              onClick={() => {
                setConfirm(true);
                if (onGetCodeClick) {
                  onGetCodeClick();
                }
              }}
            >
              Get Code
            </Button>
          </div>
        )}
        {confirmButton && (
          <div className="absolute right-4">
            <Button
              onClick={() => {
                setConfirm(true);
              }}
            >
              Confrim
            </Button>
          </div>
        )}
      </div>
    );
  }
);

export { BaseInput };
