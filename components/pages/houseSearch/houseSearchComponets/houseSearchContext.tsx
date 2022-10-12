import React, { createContext, useState } from "react";

interface IContext {
  openSearchItemId: string | null;
  setOpenSearchItemId: (id: string) => void;
  searchObject: { [key: string]: string | number };
  setSearchObject: (data: any) => void;
  setSearchObjectFromQuery: (data: any) => void;
}

export const HouseSearchContext = createContext<IContext>({
  openSearchItemId: null,
  setOpenSearchItemId: (id: string) => null,
  searchObject: {},
  setSearchObject: (data: any) => null,
  setSearchObjectFromQuery: (data) => null,
});

export const HouseSearchProvider: React.FC<any> = ({ children }) => {
  const [index, setIndex] = useState<null | string>(null);
  const [searchValues, setSearchValues] = useState<{
    [key: string]: string | number;
  }>({});

  let setVal = (data) => {
    setSearchValues({ ...searchValues, ...data });
  };

  const value = {
    openSearchItemId: index,
    setOpenSearchItemId: (id: string | null) => {
      setIndex(id);
    },
    searchObject: searchValues,
    setSearchObject: (data: any) => {
      setVal(data);
    },
    setSearchObjectFromQuery: (data: any) => {
      setSearchValues(data);
    },
  };
  return (
    <HouseSearchContext.Provider value={value}>
      {children}
    </HouseSearchContext.Provider>
  );
};
