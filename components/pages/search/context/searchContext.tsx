import React, { createContext, ReactElement, ReactNode, useState } from "react";

interface IContext {
  openSearchItemId: number | null;
  setOpenSearchItemId: (id: number) => void;
  searchObject: { [key: string]: number[] };
  setSearchObject: (data: {
    id?: number;
    question_id: number;
    is_multiple?: boolean;
    type?: string;
    value?: (number | string)[];
  }) => void;
  setSearchObjectFromQuery: (data: { [key: string]: number[] }) => void;
}

export const SearchContext = createContext<IContext>({
  openSearchItemId: null,
  setOpenSearchItemId: (id: number) => null,
  searchObject: {},
  setSearchObject: (data: any) => null,
  setSearchObjectFromQuery: (data) => null,
});

interface IProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<IProps> = ({ children }) => {
  const [index, setIndex] = useState<null | number>(null);
  const [searchValues, setSearchValues] = useState<{ [key: string]: number[] }>(
    {}
  );

  let setVal = (data: {
    id?: number;
    question_id: number;
    is_multiple?: boolean;
    type?: string;
    value?: any;
  }) => {
    console.log("dddd");
    if (data.type === "range") {
      //   debugger;
      setSearchValues({
        ...searchValues,
        [data.question_id]: [...data.value],
      });
      return;
    }

    if (!searchValues[data.question_id]) {
      setSearchValues({ ...searchValues, [data.question_id]: [data.id] });
    } else {
      if (searchValues[data.question_id].find((el) => el === data.id)) {
        setSearchValues({
          ...searchValues,
          [data.question_id]: [
            ...searchValues[data.question_id].filter((el) => el !== data.id),
          ],
        });
      } else {
        if (data.is_multiple) {
          setSearchValues({
            ...searchValues,
            [data.question_id]: [...searchValues[data.question_id], data.id],
          });
        } else {
          setSearchValues({
            ...searchValues,
            [data.question_id]: [data.id],
          });
        }
      }
    }
  };
  const value = {
    openSearchItemId: index,
    setOpenSearchItemId: (id: number | null) => {
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
    <SearchContext.Provider value={value}>{children}</SearchContext.Provider>
  );
};
