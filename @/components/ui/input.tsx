import * as React from "react";
import { cn } from "../../lib/utils";
import errorIcon from "../../../public/imgs/Error.svg";
import successIcon from "../../../public/imgs/Success.svg";
import Image from "next/image";
import { Button } from "../ui/button";
import useTranslation from "next-translate/useTranslation";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean;
  isSuccess?: boolean;
  getCode?: boolean;
  clicked?: boolean;
  onGetCodeClick?: () => void;
}

const BaseInput = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      hasError,
      isSuccess,
      getCode,
      onGetCodeClick,
      clicked,
      ...props
    },
    ref
  ) => {
    let { t } = useTranslation("common") as { t: (key: string) => string };
    return (
      <div className="relative flex items-center w-full  ">
        <input
          type={type}
          className={cn(
            "h-12 w-full  rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inputFocusBeta disabled:cursor-not-allowed disabled:opacity-50",
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
          <div className="absolute right-4  ">
            <Button
              type="button"
              className="bg-[#F2F5FF] text-[#484848] focus:bg-[#ced0d7] hover:bg-[#ced0d7]"
              onClick={() => {
                if (onGetCodeClick) {
                  onGetCodeClick();
                }
              }}
            >
              {clicked ? t("resend") : t("getCode")}
            </Button>
          </div>
        )}
      </div>
    );
  }
);

export { BaseInput };
