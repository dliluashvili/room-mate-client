import React, { useContext, useEffect, useState } from "react";
import { IQuestions } from "../../../../services/questions/questions.http";
import classnames from "classnames";
import { HouseSearchContext } from "./houseSearchContext";
import useTranslation from "next-translate/useTranslation";

interface IProps {
  data: { id: number; title: string }[];
  name: string;
  title: string;
}

const Choice: React.FC<IProps> = ({ data, name, title }) => {
  let { t } = useTranslation("common");

  // const [openSelect, setOpenSelect] = useState<boolean | number>(false);
  const {
    openSearchItemId,
    setOpenSearchItemId,
    setSearchObject,
    searchObject
  } = useContext(HouseSearchContext);
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

  const isChecked = ({ id }: { id: number }) => {
    if (searchObject[name]) {
      let selected = searchObject[name].toString().split(",");

      if (selected.find((el) => Number(el) === id)) {
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
      className="search_item search_item-choice"
    >
      <label>{title}</label>
      <div
        onClick={() => {
          if (openSearchItemId === name) {
            setOpenSearchItemId(null);
          } else {
            setOpenSearchItemId(name);
          }
        }}
        className="selectBtn"
      >
        <div className="d-flex justify-content-between align-items-center">
          <span>{t("chose")}</span>
          <svg
            width="14"
            height="8"
            viewBox="0 0 14 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              transform: `rotate(${
                openSearchItemId !== name ? "180deg" : "0deg"
              })`
            }}
          >
            <path
              d="M12.6909 0.377512C12.5004 0.204384 12.2095 0.204227 12.0188 0.377148L7.33585 4.62308C7.14528 4.79587 6.85472 4.79587 6.66415 4.62308L1.98121 0.377148C1.79049 0.204227 1.49965 0.204385 1.30912 0.377514L0.407246 1.19701C0.188912 1.3954 0.188912 1.73871 0.407246 1.93711L6.66375 7.62215C6.85443 7.79542 7.14557 7.79542 7.33625 7.62215L13.5928 1.93711C13.8111 1.73871 13.8111 1.3954 13.5928 1.19701L12.6909 0.377512Z"
              fill="#7D7D7D"
            />
          </svg>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className={classnames("optionsWrapper", {
            ["d-block"]: openSearchItemId === name,
            ["d-none"]: openSearchItemId !== name
          })}
        >
          {data.map((el) => {
            return (
              <div key={el.id}>
                <label className="d-flex checkbox_wrapper checkbox_wrapper-search">
                  <div className="checkbox_item">
                    <input
                      onChange={() => {
                        if (
                          searchObject[name] &&
                          searchObject[name]
                            .toString()
                            .split(",")
                            .includes(el.id.toString())
                        ) {
                          debugger;
                          setSearchObject({
                            [name]: searchObject[name]
                              .toString()
                              .split(",")
                              .filter((item) => Number(item) !== el.id)
                              .join(",")
                          });
                        } else {
                          setSearchObject({
                            [name]: searchObject[name]
                              ? searchObject[name] + "," + el.id
                              : el.id
                          });
                        }
                      }}
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
      <div className="selectedSearch_wrapper">
        {data.map((el) => {
          if (searchObject[name]) {
            if (
              searchObject[name]
                .toString()
                .split(",")
                .find((it) => Number(it) === el.id)
            ) {
              return (
                <div
                  className="searchCancel"
                  onClick={() => {
                    setSearchObject({
                      [name]: searchObject[name]
                        .toString()
                        .split(",")
                        .filter((item) => Number(item) !== el.id)
                        .join(",")
                    });
                    // setSearchObject({ name:  });
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
                  {el.title}
                </div>
              );
            }
          }
        })}
      </div>
    </div>
  );
};

export default Choice;
