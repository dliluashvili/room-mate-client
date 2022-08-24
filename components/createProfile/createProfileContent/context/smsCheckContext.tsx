import React, { Children, createContext, ReactNode, useState } from "react";

interface ISmsCheckProps {
  smsCode: string;
  setSmsCode: (v: any) => void;
  isVerify: boolean;
  setIsVerify: (v: any) => void;
}

export const SmsCheckContext = createContext<ISmsCheckProps>({
  smsCode: "",
  setSmsCode: () => null,
  isVerify: false,
  setIsVerify: () => null,
});
interface IProps {
  children: ReactNode;
}

export const SmsCheckProvider: React.FC<IProps> = ({ children }) => {
  const [smsCode, setSmsCode] = useState("");
  const [isVerify, setIsVerify] = useState(false);

  const value = {
    smsCode,
    setSmsCode,
    isVerify,
    setIsVerify,
  };

  return (
    <SmsCheckContext.Provider value={value}>
      {children}
    </SmsCheckContext.Provider>
  );
};
