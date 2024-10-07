import { FC, createContext, useState } from "react";

interface IMainContext {
  referralCode: string | null;
  changeReferalCode: (slug: string | null) => void;
}

export const MainContext = createContext<IMainContext | undefined>(undefined);

interface Props {
  children?: React.ReactNode;
}

export const MainContextProvider: FC<Props> = ({ children }) => {
  const [referralCode, setReferralCode] = useState<string | null>(null);

  const changeReferalCode = (slug: string | null) => {
    setReferralCode(slug);
  };

  return (
    <MainContext.Provider
      value={{
        referralCode,
        changeReferalCode,
      }}
    >
      {children}
    </MainContext.Provider>
  );
};
