import React, { useContext, useEffect, useState } from "react";
import { IQuestions } from "../../../../services/questions/questions.http";
import classnames from "classnames";
import { HouseSearchContext } from "./houseSearchContext";
import { Button } from "../../../common/form";
import useTranslation from "next-translate/useTranslation";

interface IProps {
  data: IQuestions;
  setValue?: (val: any) => void;
  searchHandler: () => void;
}

const TextSearch: React.FC<any> = ({ searchHandler }) => {
  const {
    openSearchItemId,
    setOpenSearchItemId,
    setSearchObject,
    searchObject,
  } = useContext(HouseSearchContext);
  let { t } = useTranslation("common");

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="locationSearch_wrapper search_item"
    >
      <div className="d-flex">
        <div
          className="locationSearch_input locationSearch_input-TestSearch p-0"
          placeholder={t("searchPlh")}
        >
          <input
            onChange={(e) => {
              setSearchObject({
                ...searchObject,
                Keyword: e.target.value,
              });
            }}
            value={searchObject["Keyword"]}
          />
        </div>
        <Button
          onClick={(e) => {
            searchHandler();
          }}
          className="btn btn-primary locationSearch_button"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17.2688 15.1976L13.9582 11.8876C13.8088 11.7382 13.6062 11.6552 13.3937 11.6552H12.8525C13.7689 10.4832 14.3135 9.00913 14.3135 7.40558C14.3135 3.59091 11.2221 0.5 7.40676 0.5C3.59144 0.5 0.5 3.59091 0.5 7.40558C0.5 11.2202 3.59144 14.3112 7.40676 14.3112C9.01058 14.3112 10.4849 13.7667 11.6571 12.8504V13.3915C11.6571 13.604 11.7401 13.8065 11.8895 13.9559L15.2001 17.2659C15.5122 17.578 16.017 17.578 16.3258 17.2659L17.2655 16.3264C17.5776 16.0143 17.5776 15.5097 17.2688 15.1976ZM7.40676 11.6552C5.05912 11.6552 3.15644 9.75613 3.15644 7.40558C3.15644 5.05834 5.0558 3.15599 7.40676 3.15599C9.75439 3.15599 11.6571 5.05502 11.6571 7.40558C11.6571 9.75281 9.75771 11.6552 7.40676 11.6552Z"
              fill="white"
            />
          </svg>
          <span> {t("searchBtn")}</span>
        </Button>
      </div>
    </div>
  );
};

export default TextSearch;
