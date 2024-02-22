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
  resend?: boolean;
  setResend?: (value: boolean) => void;
  resendButton?: boolean;
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
      resend,
      setResend,
      resendButton,
      onGetCodeClick,
      ...props
    },
    ref
  ) => {
    const [isDisabled, setIsDisabled] = React.useState(false);
    const [countdown, setCountdown] = React.useState(30);

    React.useEffect(() => {
      if (resend) {
        setIsDisabled(true);
        setCountdown(30);
        const timer = setInterval(() => {
          setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);
        const timeout = setTimeout(() => {
          setIsDisabled(false);
          clearInterval(timer);
        }, 30000);
        return () => {
          clearTimeout(timeout);
          clearInterval(timer);
        };
      }
    }, [resend]);
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
              className="bg-[#F2F5FF] text-[#484848] hover:bg-[#ced0d7]"
              onClick={() => {
                if (onGetCodeClick) {
                  onGetCodeClick();
                }
              }}
            >
              {t("getCode")}
            </Button>
          </div>
        )}
        {resendButton && (
          <div className="absolute right-4">
            <Button
              disabled={isDisabled}
              onClick={() => {
                setResend(true);
                setIsDisabled(true);
                setCountdown(30);
                if (onGetCodeClick) {
                  onGetCodeClick();
                }
                const timer = setInterval(() => {
                  setCountdown((prevCountdown) => prevCountdown - 1);
                }, 1000);
                const timeout = setTimeout(() => {
                  setIsDisabled(false);
                  clearInterval(timer);
                }, 30000);
              }}
              style={{
                background: `linear-gradient(90deg, #19A463 ${
                  ((30 - countdown) * 100) / 30
                }%, #70a38b ${((30 - countdown) * 100) / 30}%`,
              }}
            >
              Resend
            </Button>
          </div>
        )}
      </div>
    );
  }
);

export { BaseInput };
