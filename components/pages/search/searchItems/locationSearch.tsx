import React, { useContext, useEffect } from "react";
import { IQuestions } from "../../../../services/questions/questions.http";
import classnames from "classnames";
import { SearchContext } from "../context/searchContext";
import { Button } from "../../../common/form";
import useTranslation from "next-translate/useTranslation";

interface IProps {
  data: IQuestions;
  setValue?: (val: any) => void;
  searchHandler: () => void;
}

const LocationSearch: React.FC<IProps> = ({ data, searchHandler }) => {
  const {
    openSearchItemId,
    setOpenSearchItemId,
    setSearchObject,
    searchObject,
  } = useContext(SearchContext);
  let { t } = useTranslation("common");

  useEffect(() => {
    let remove = () => {
      // debugger;
      setOpenSearchItemId(null);
    };

    window.addEventListener("click", remove);

    return () => {
      window.removeEventListener("click", remove);
    };
  }, []);

  const isChecked = ({
    id,
    question_id,
  }: {
    id: number;
    question_id: number;
  }) => {
    if (searchObject && searchObject[question_id]) {
      let answers = searchObject[data.id];
      if (answers.find((el) => el === id)) {
        return true;
      }
    }
    return false;
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
      }}
      className="locationSearch_wrapper search_item"
    >
      <div className="d-flex">
        <div
          onClick={() => {
            if (openSearchItemId === data?.id) {
              setOpenSearchItemId(null);
            } else {
              setOpenSearchItemId(data?.id);
            }
          }}
          className="locationSearch_input"
          placeholder={t("searchPlh")}
        >
          {!data?.id
            ? null
            : !searchObject[data.id]?.length
            ? t("searchPlh")
            : data?.answers.map((el) => {
                if (searchObject[el.question_id]) {
                  if (searchObject[el.question_id].find((it) => it === el.id)) {
                    return (
                      <div
                        className="searchCancel"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSearchObject({
                            ...el,
                            is_multiple: data.is_multiple,
                          });
                        }}
                      >
                        {" "}
                        <svg
                          width="10"
                          height="10"
                          viewBox="0 0 23 23"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M11.5 0C5.16235 0 0 5.16235 0 11.5C0 17.8377 5.16235 23 11.5 23C17.8377 23 23 17.8377 23 11.5C23 5.16235 17.8377 0 11.5 0ZM11.5 2.3C16.5946 2.3 20.7 6.40536 20.7 11.5C20.7 16.5946 16.5946 20.7 11.5 20.7C6.40536 20.7 2.3 16.5946 2.3 11.5C2.3 6.40536 6.40536 2.3 11.5 2.3ZM7.71309 6.08691L6.08691 7.71309L9.87383 11.5L6.08691 15.2869L7.71309 16.9131L11.5 13.1262L15.2869 16.9131L16.9131 15.2869L13.1262 11.5L16.9131 7.71309L15.2869 6.08691L11.5 9.87383L7.71309 6.08691Z"
                            fill="red"
                          />
                        </svg>
                        {el.title}{" "}
                      </div>
                    );
                  }
                }
              })}
        </div>
        <Button
          onClick={searchHandler}
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
      {data?.id ? (
        <div className="selectBtn ">
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className={classnames("optionsWrapper", {
              ["d-flex"]: openSearchItemId === data.id,
              ["d-none"]: openSearchItemId !== data.id,
            })}
          >
            {data.answers.map((el) => {
              return (
                <div key={el.id}>
                  <label className="d-flex checkbox_wrapper checkbox_wrapper-search">
                    <div className="checkbox_item">
                      <input
                        onChange={() =>
                          setSearchObject({
                            ...el,
                            is_multiple: data.is_multiple,
                          })
                        }
                        checked={isChecked(el)}
                        type="checkbox"
                      />
                      <span className="checkmark"></span>
                    </div>
                    <div className="">{el.title} </div>
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default LocationSearch;
