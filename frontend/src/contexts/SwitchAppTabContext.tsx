import { FC, createContext, useState } from "react";

interface ISwitchAppTabContext {
  currentTab: string;
  switchTab: (slug: string) => void;
}

export const SwitchAppTabContext = createContext<ISwitchAppTabContext | undefined>(undefined);

interface Props {
  children?: React.ReactNode;
  defaultTab: string;
}

export const SwitchAppTabProvider: FC<Props> = ({ children, defaultTab }) => {
  const [currentTab, setCurrentTab] = useState(defaultTab !== "" ? defaultTab : "invest");

  const switchTab = (slug: string) => {
    history.pushState({}, slug, `/app/${slug}`);
    setCurrentTab(slug);
  };

  return (
    <SwitchAppTabContext.Provider
      value={{
        switchTab,
        currentTab,
      }}
    >
      {children}
    </SwitchAppTabContext.Provider>
  );
};
