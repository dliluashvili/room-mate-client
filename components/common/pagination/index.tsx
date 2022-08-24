import React, { memo, useMemo } from "react";
import { useRouter } from "next/router";
import classnames from "classnames";
import Link from "next/link";

const PaginationItem = ({ page, index, href, onClick }) => {
  return (
    <Link href={href}>
      <a className={page == index + 1 && "active"} onClick={onClick}>
        <span>{index + 1}</span>
      </a>
    </Link>
  );
};

const GetButton = ({ href, btnClass, btnType = null, buttonInner = null }) => {
  return (
    <Link href={href}>
      <a className={btnClass}>
        {buttonInner ? (
          buttonInner
        ) : btnType == "prev" ? (
          <img src="imgs/Vector.svg" />
        ) : (
          <img src="imgs/Vector (1).svg" />
        )}
      </a>
    </Link>
  );
};

interface IProps {
  setLoad?: () => void;
  maxItem?: number;
  maxPage?: number;
  next?: any;
  prev?: any;
}

const Pagination: React.FC<IProps> = ({
  setLoad,
  maxItem,
  maxPage,
  next,
  prev,
}) => {
  const router = useRouter();

  const getPagination = useMemo(() => {
    let paginationList = [];
    let page = 1;
    if (router?.query?.page) {
      page = Number(router?.query?.page);
    }
    for (let index = 0; index < maxPage; index++) {
      if (page < 3) {
        paginationList.push(
          <PaginationItem
            href={{
              pathname: "/search",
              query: {
                ...router?.query,
                page: index + 1,
              },
            }}
            index={index}
            page={page}
            onClick={setLoad}
          />
        );
      } else if (index > page - 5 || index > maxPage - 8) {
        paginationList.push(
          <PaginationItem
            href={{
              pathname: "/search",
              query: {
                ...router.query,
                page: index + 1,
              },
            }}
            index={index}
            page={page}
            onClick={setLoad}
          />
        );
      }

      if (paginationList.length > 6) {
        return paginationList;
      }
    }

    return paginationList;
  }, [setLoad, maxItem, maxPage, router?.query]);

  return (
    <div className="beks_pagination pagination">
      <GetButton
        href={{
          pathname: "/search",
          query: {
            ...router?.query,
            page: Number(router?.query?.page) - 1,
          },
        }}
        btnType="prev"
        btnClass={classnames("pagination_prevBtn", {
          disabledLink: Number(router?.query?.page) <= 1,
        })}
        buttonInner={prev}
      />
      {getPagination}
      <GetButton
        href={{
          pathname: "/search",
          query: {
            ...router?.query,
            page: Number(router?.query?.page) + 1,
          },
        }}
        btnClass={classnames("pagination_nextBtn", {
          disabledLink: Number(router?.query?.page) >= maxPage,
        })}
        buttonInner={next}
      />
    </div>
  );
};

export default memo(Pagination);
