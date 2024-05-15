"use client";

import React, { useEffect, useState } from "react";
import ImgPreview from "./imgsPreviev";
import Link from "next/link";
import { Flats } from "../../../services/flats/flats.http";
import useTranslation from "next-translate/useTranslation";
import classNames from "classnames";
import ImgPreview2 from "./imgsPreviev2";

const HouseCard2 = ({ data, isAuth, addRemoveFavorite, className }: any) => {
  let { t } = useTranslation("common");
  const [images, setImages] = useState([]);

  useEffect(() => {
    const image = data["13"];

    if (image) {
      const linksArray = image.split(",");

      const imageUrls = linksArray.map((link) => {
        const fileId = link.split("open?id=")[1]; // Extract the file ID
        return `https://drive.google.com/uc?export=view&id=${fileId}`; // Construct the new URL
      });

      setImages(imageUrls);
    }
  }, []);

  return (
    <>
      <Link href={"/houseCheck/" + data["თქვენი მობილურის ნომერი"]}>
        <a className={classNames("houseCard_link", className)}>
          <div className="houseCard">
            <div className="houseCard_imageBLock">
              <ImgPreview2 images={images} />
            </div>
            <div className="houseCard_body">
              <div className="flex">
                <svg
                  width="16"
                  className="mr-2"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.08487 14.2901H1.39461C1.34276 14.2901 1.29138 14.2929 1.23999 14.2901C1.09776 14.2791 0.991784 14.1772 1.0005 14.0496C1.01059 13.9027 1.09685 13.8164 1.24412 13.8127C1.46709 13.8063 1.69053 13.8105 1.91396 13.8105H3.11371V2.16584C3.11371 2.11398 3.11371 2.06259 3.11371 2.01118C3.11784 1.78949 3.19354 1.71146 3.41423 1.711C4.23272 1.711 5.05121 1.711 5.8697 1.711H6.08441C6.08441 1.56687 6.08441 1.43193 6.08441 1.2979C6.08992 1.06841 6.19866 0.978887 6.42346 1.00413C7.91822 1.17335 9.41313 1.34164 10.9082 1.50902C11.482 1.57389 12.0558 1.64045 12.6296 1.70869C12.8131 1.73072 12.8778 1.80324 12.8842 1.98776C12.8842 2.04513 12.8842 2.10252 12.8842 2.15943V13.8105H13.1338C13.666 13.8105 14.1987 13.8105 14.7309 13.8105C14.8956 13.8105 15.0062 13.9197 14.9997 14.0588C14.9933 14.1979 14.8892 14.2832 14.7304 14.2883C14.6905 14.2883 14.6501 14.2883 14.6102 14.2883C14.1354 14.2883 13.6587 14.2658 13.1852 14.2933C12.4612 14.3355 11.7377 14.4007 11.016 14.4769C9.84424 14.5999 8.67615 14.7395 7.50347 14.8717C7.15112 14.9116 6.7983 14.9488 6.44824 14.9914C6.19086 15.0231 6.08854 14.9368 6.08579 14.6738C6.08396 14.5554 6.08487 14.4352 6.08487 14.2901ZM6.57441 14.4957L12.3892 13.8371V2.16127L6.57441 1.50445V14.4957ZM6.07248 13.7999V3.29909H4.70298V13.7981L6.07248 13.7999ZM6.07707 2.20074H3.60646V13.7981H4.21298V5.08366C4.21298 4.42501 4.21298 3.76635 4.21298 3.10769C4.21298 2.88646 4.29282 2.80889 4.51258 2.80751C4.78143 2.80751 5.05075 2.80751 5.3196 2.80751H6.07661L6.07707 2.20074ZM8.31554 8.00101C8.31554 8.09547 8.29684 8.18898 8.26052 8.27616C8.2242 8.36335 8.17097 8.44246 8.10391 8.50895C8.03685 8.57544 7.95729 8.62797 7.86983 8.66353C7.78236 8.69908 7.68872 8.71695 7.59431 8.7161C7.40665 8.71225 7.22804 8.63472 7.09705 8.50024C6.96605 8.36575 6.89319 8.18511 6.89419 7.99734C6.89412 7.90289 6.91278 7.80935 6.94909 7.72217C6.9854 7.63498 7.03863 7.55589 7.10571 7.48942C7.17278 7.42296 7.25237 7.37045 7.33986 7.33496C7.42736 7.29948 7.52101 7.2817 7.61542 7.28268C7.80307 7.28629 7.98176 7.3637 8.11279 7.49814C8.24382 7.63258 8.31666 7.81325 8.31554 8.00101ZM7.59844 8.23416C7.65902 8.23458 7.71741 8.21148 7.7613 8.16971C7.8052 8.12793 7.83119 8.07074 7.8338 8.01018C7.83675 7.94957 7.81605 7.8902 7.77608 7.84456C7.73611 7.79892 7.67999 7.77058 7.61954 7.76553C7.58809 7.76364 7.55658 7.76827 7.52698 7.77909C7.49739 7.78992 7.47034 7.80672 7.44752 7.82847C7.42471 7.85022 7.40661 7.87644 7.39437 7.9055C7.38213 7.93455 7.37601 7.96581 7.37638 7.99734C7.37525 8.05798 7.39782 8.11666 7.4393 8.1609C7.48077 8.20514 7.53787 8.23142 7.59844 8.23416Z"
                    fill="#5E666E"
                    stroke="#5E666E"
                    strokeWidth="0.5"
                  />
                </svg>
                <span>
                  {t("Numberofrooms")}: {data["ჯამური ოთახების რაოდენობა"]}
                </span>
              </div>
              {data.capacity ? (
                <div
                  style={{
                    opacity: data.capacity ? 1 : 0,
                  }}
                >
                  <svg
                    className="mr-10"
                    width="17"
                    height="13"
                    viewBox="0 0 17 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1.48805 10.7547C1.46281 10.7504 1.43732 10.7479 1.41174 10.7472C1.10042 10.7752 0.983314 10.6875 1.00189 10.3081C1.0136 10.069 1.00391 9.82899 1.00431 9.58943C1.00431 9.32398 1.07861 9.24844 1.33744 9.24677H1.48805V9.02181C1.48805 8.46532 1.48805 7.90883 1.48805 7.35234C1.48805 6.70375 1.81674 6.32019 2.45714 6.2413V6.061C2.45714 4.73822 2.45714 3.41559 2.45714 2.09309C2.45714 1.4132 2.85407 1 3.50699 1H13.4983C14.1521 1 14.5482 1.4132 14.5482 2.09226C14.5482 3.41503 14.5482 4.73766 14.5482 6.06016V6.23296C14.6483 6.25466 14.7424 6.26718 14.8308 6.29515C15.0279 6.35643 15.2007 6.48164 15.3235 6.65226C15.4464 6.82288 15.5129 7.02986 15.5132 7.24257C15.5177 7.8465 15.5132 8.45043 15.5132 9.05436V9.24927C15.5972 9.24927 15.6747 9.24552 15.7535 9.24927C15.8976 9.25846 15.9917 9.34861 15.9958 9.49677C16.0014 9.83066 16.0014 10.1646 15.9958 10.4985C15.9933 10.647 15.9001 10.7384 15.7567 10.7489C15.6824 10.7539 15.6073 10.7489 15.5144 10.7489C15.5144 11.0544 15.5144 11.3495 15.5144 11.6445C15.5144 11.9229 15.4422 11.9989 15.1773 11.9993C14.9806 11.9993 14.7844 11.9993 14.5877 11.9993C14.4157 11.9972 14.3394 11.9334 14.3051 11.7606C14.2445 11.4605 14.184 11.16 14.1303 10.8582C14.1153 10.7748 14.0846 10.7389 14.0035 10.7493C13.9783 10.751 13.9531 10.751 13.928 10.7493C10.3106 10.7493 6.69288 10.748 3.07494 10.7455C2.92837 10.7455 2.87628 10.7873 2.85447 10.9338C2.8141 11.2109 2.75312 11.4851 2.6978 11.7602C2.66307 11.9325 2.58595 11.9968 2.41515 11.9989C2.19831 11.9989 1.98189 12.0014 1.76505 11.9989C1.57891 11.9964 1.49047 11.9033 1.48886 11.7067C1.48805 11.3925 1.48805 11.0803 1.48805 10.7547ZM3.42623 6.24005C3.42623 5.89489 3.42139 5.56267 3.42623 5.23044C3.42853 4.97195 3.5286 4.72465 3.70502 4.54144C3.88145 4.35822 4.12022 4.25363 4.37029 4.25005C5.3523 4.24281 6.33485 4.24281 7.31794 4.25005C7.77099 4.25255 8.1659 4.58144 8.23293 5.04639C8.27937 5.37277 8.25595 5.70999 8.26322 6.04264C8.26322 6.10816 8.26322 6.17369 8.26322 6.23421H8.74776C8.74776 5.92494 8.74776 5.62819 8.74776 5.33144C8.74776 4.66365 9.14872 4.24629 9.79155 4.24629C10.7087 4.24629 11.6256 4.24629 12.5422 4.24629C13.1854 4.24629 13.5839 4.66365 13.5851 5.33144C13.5851 5.63195 13.5851 5.93204 13.5851 6.2363H14.0697V6.08772C14.0697 4.74991 14.0697 3.41197 14.0697 2.07389C14.0697 1.69241 13.8811 1.49709 13.5125 1.49709H3.50457C3.12662 1.49709 2.93926 1.69033 2.93926 2.08141C2.93926 3.41448 2.93926 4.74727 2.93926 6.07979V6.23838L3.42623 6.24005ZM15.0351 9.24135C15.0351 8.58525 15.0351 7.94542 15.0351 7.30559C15.0351 6.94749 14.8393 6.74716 14.4904 6.74716H2.51852C2.16884 6.74716 1.97381 6.94749 1.973 7.30517C1.973 7.90368 1.973 8.5019 1.973 9.09985C1.973 9.14493 1.97825 9.19001 1.98108 9.23968L15.0351 9.24135ZM1.49774 10.2359H15.5064V9.7547H1.49613L1.49774 10.2359ZM7.77786 6.2413C7.77786 5.88779 7.78553 5.54973 7.77544 5.2125C7.77045 5.08829 7.71931 4.97085 7.63266 4.88464C7.54602 4.79842 7.43054 4.75006 7.31027 4.74963C6.3331 4.74518 5.35608 4.74518 4.37918 4.74963C4.147 4.74963 3.93501 4.93161 3.92007 5.167C3.90069 5.5226 3.91523 5.8807 3.91523 6.24298L7.77786 6.2413ZM13.0986 6.2413C13.0986 5.88779 13.1062 5.54973 13.0962 5.2125C13.0912 5.08829 13.04 4.97085 12.9534 4.88464C12.8667 4.79842 12.7513 4.75006 12.631 4.74963C11.6544 4.74518 10.6775 4.74518 9.70029 4.74963C9.46811 4.74963 9.25371 4.93161 9.24119 5.167C9.22181 5.5226 9.23594 5.8807 9.23594 6.24298L13.0986 6.2413ZM2.40222 10.7568H1.98593V11.4834H2.26211C2.30814 11.2372 2.35297 11.0035 2.40062 10.7568H2.40222ZM15.0238 11.4897V10.7601H14.6067C14.656 11.0106 14.7024 11.2497 14.7497 11.4914L15.0238 11.4897Z"
                      fill="#5E666E"
                      stroke="#5E666E"
                      strokeWidth="0.6"
                    />
                  </svg>
                  {t("maximumPersonsInApartamnet")}: {data.capacity}
                </div>
              ) : null}

              {data.each_pay ? (
                <div className="green d-flex align-items-center">
                  <svg
                    width="16"
                    className="mr-10"
                    height="13"
                    viewBox="0 0 16 13"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M15 7.78782V9.62092C14.9315 9.76441 14.8192 9.80028 14.6733 9.80028C13.9809 9.79526 13.2882 9.79813 12.5954 9.79813H12.4318V9.96422C12.4318 10.5324 12.4318 11.1006 12.4318 11.6685C12.4318 11.9214 12.3554 12 12.1116 12H3.89626C3.64286 12 3.56958 11.9239 3.56958 11.661C3.56958 11.0978 3.56958 10.5346 3.56958 9.9714V9.7967H3.41274C2.71555 9.7967 2.01836 9.7967 1.32117 9.7967C1.07667 9.7967 1.00202 9.71885 1.00167 9.46523C1.00167 9.04014 0.997907 8.61541 1.00167 8.19067C1.01708 6.66716 1.65709 5.53609 2.94155 4.8111L2.99875 4.77774C2.86588 4.5625 2.71247 4.35695 2.60598 4.1288C1.99336 2.81192 2.81999 1.2206 4.20753 1.02509C4.67132 0.958305 5.14319 1.05416 5.54953 1.29773C5.6865 1.37772 5.73376 1.50471 5.67623 1.63063C5.6187 1.75654 5.48138 1.80999 5.33996 1.73035C4.99205 1.53556 4.62975 1.45126 4.23458 1.51296C3.48363 1.63063 2.89636 2.33086 2.86793 3.15558C2.84054 3.95339 3.40144 4.70779 4.1387 4.86599C4.39354 4.92217 4.65706 4.91886 4.91055 4.8563C5.08176 4.81433 5.20607 4.87818 5.23826 5.01916C5.2725 5.17126 5.18826 5.28426 5.01259 5.32874C4.52681 5.45804 4.01278 5.3988 3.56547 5.16194C3.50161 5.13305 3.42956 5.13125 3.36446 5.15692C2.19471 5.69034 1.56053 6.6277 1.4756 7.96037C1.44753 8.40125 1.47149 8.84607 1.47149 9.29878H3.58842C3.81887 7.58335 4.67735 6.34681 6.16214 5.56802C5.56083 4.87424 5.31531 4.06639 5.48995 3.14338C5.60146 2.5213 5.93008 1.96501 6.41178 1.58292C7.46476 0.732375 8.88586 0.82313 9.81214 1.78631C10.724 2.73479 10.8911 4.38888 9.84193 5.56622C11.3185 6.3394 12.1754 7.58383 12.4126 9.2995H14.5137C14.5182 9.29448 14.5295 9.2873 14.5292 9.28049C14.5165 8.57702 14.6093 7.86566 14.4031 7.17583C14.1148 6.21157 13.5234 5.53394 12.6307 5.14974C12.5692 5.12706 12.5017 5.12976 12.442 5.15728C11.991 5.39732 11.472 5.45737 10.9819 5.32624C10.8144 5.28355 10.7323 5.17378 10.7617 5.0249C10.7901 4.88141 10.9151 4.81505 11.0839 4.852C12.002 5.0536 12.8074 4.57363 13.0673 3.6682C13.1572 3.3502 13.1555 3.01145 13.0624 2.69446C12.9692 2.37748 12.7888 2.09637 12.5437 1.8864C12.0082 1.4362 11.4171 1.36732 10.7894 1.66112C10.7312 1.68838 10.6761 1.72282 10.6182 1.74578C10.5654 1.76949 10.506 1.77115 10.452 1.7504C10.3981 1.72966 10.3538 1.68809 10.3282 1.63421C10.2737 1.52301 10.2987 1.38526 10.4138 1.32392C10.5949 1.22742 10.7816 1.12877 10.9768 1.07568C11.9013 0.824567 12.8153 1.22634 13.3121 2.08944C13.7806 2.90303 13.6734 3.94621 13.0461 4.67694C13.0252 4.70133 13.006 4.72752 12.994 4.74294C13.2337 4.91119 13.484 5.05934 13.7039 5.24516C14.4422 5.8715 14.8634 6.68689 14.9767 7.6759C14.9822 7.71369 14.99 7.75108 15 7.78782Z"
                      fill="#19A463"
                      stroke="#19A463"
                      strokeWidth="0.5"
                    />
                  </svg>

                  <span>
                    {t("RentAmountPerPerson")}: {data.each_pay} ₾
                  </span>
                </div>
              ) : null}
            </div>
            <div className="houseCard_footer">
              <div className="houseCard_locations flex">
                <svg
                  width="13"
                  height="18"
                  viewBox="0 0 13 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M6.5 17.2522C6.33391 17.0636 6.1183 16.8146 5.86773 16.5153C5.26494 15.7955 4.46213 14.788 3.66036 13.6362C2.85757 12.483 2.06237 11.1944 1.46949 9.9117C0.873426 8.62215 0.5 7.37688 0.5 6.3C0.5 3.10776 3.16773 0.5 6.5 0.5C9.83227 0.5 12.5 3.10776 12.5 6.3C12.5 7.37688 12.1266 8.62215 11.5305 9.9117C10.9376 11.1944 10.1424 12.483 9.33964 13.6362C8.53787 14.788 7.73506 15.7955 7.13227 16.5153C6.8817 16.8146 6.66608 17.0636 6.5 17.2522ZM3.67857 6.3C3.67857 7.83276 4.95727 9.05 6.5 9.05C8.04273 9.05 9.32143 7.83276 9.32143 6.3C9.32143 4.76724 8.04273 3.55 6.5 3.55C4.95727 3.55 3.67857 4.76724 3.67857 6.3Z"
                    stroke="#5E666E"
                  />
                </svg>
                <span>{data["რომელ უბანში მდებარეობს თქვენი ბინა?"]}</span>
              </div>
              <div className="d-flex">
                <span className="price">
                  <span>{data["მიუთითეთ ბინის ღირებულება"]}</span>
                  <svg
                    width="14"
                    height="17"
                    viewBox="0 0 14 17"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M3.67865 14.9211C3.62924 14.8825 3.58788 14.8494 3.54565 14.8174C2.77323 14.237 2.14056 13.4698 1.69938 12.5785C1.35001 11.8834 1.12716 11.1239 1.04259 10.3403C0.931858 9.30416 1.03512 8.29116 1.37493 7.31111C1.59937 6.66628 1.92027 6.06451 2.32514 5.5292C2.83989 4.84426 3.46278 4.30122 4.18291 3.88014C4.49428 3.69995 4.82041 3.55045 5.15724 3.43348C5.2855 3.38828 5.28564 3.38751 5.2855 3.24041C5.2855 2.88047 5.28708 2.52023 5.28263 2.16045C5.28148 2.06606 5.30848 2.0017 5.3734 1.93474C5.6503 1.64912 5.91916 1.35507 6.19276 1.06501C6.21316 1.04325 6.23097 0.999124 6.26458 1.01567C6.29129 1.02885 6.27894 1.07145 6.27894 1.10102C6.2798 1.74703 6.28023 2.39305 6.28023 3.03906C6.28023 3.16165 6.28023 3.15996 6.39211 3.14755C6.82531 3.09681 7.26244 3.09747 7.69549 3.14954C7.78885 3.16119 7.7989 3.15307 7.79904 3.0501C7.79904 2.74364 7.80062 2.43718 7.79904 2.13072C7.79786 2.09923 7.80312 2.06784 7.81446 2.03873C7.82579 2.00963 7.84293 1.9835 7.86468 1.96217C8.14905 1.66245 8.43084 1.36013 8.7145 1.0598C8.73676 1.03636 8.75643 0.986252 8.79004 1.00357C8.81977 1.01889 8.80369 1.06899 8.80369 1.10362C8.80474 1.81869 8.80517 2.53376 8.80498 3.24883C8.80498 3.38781 8.80498 3.38858 8.92562 3.43072C9.688 3.69632 10.3927 4.12249 10.9978 4.68398C11.6736 5.3044 12.2102 6.07869 12.5682 6.94979C12.7625 7.41971 12.9052 7.91204 12.9935 8.41696C13.0105 8.5138 12.9962 8.58214 12.9264 8.654C12.6715 8.91633 12.4237 9.18663 12.1728 9.45325C12.1551 9.47194 12.1396 9.50627 12.1099 9.49432C12.0802 9.48237 12.0865 9.44589 12.0853 9.41954C12.071 9.0953 12.0422 8.77322 11.9793 8.45496C11.828 7.68882 11.5289 6.99545 11.0935 6.36461C10.7107 5.81022 10.2439 5.35681 9.70032 4.99014C9.45239 4.82532 9.19138 4.68401 8.92031 4.56784C8.809 4.51926 8.80383 4.52371 8.80383 4.65104C8.80383 5.87397 8.80239 7.09704 8.8057 8.31997C8.8057 8.43596 8.77697 8.52024 8.69726 8.6016C8.42553 8.87833 8.16112 9.16319 7.89297 9.44436C7.87014 9.46842 7.84788 9.5176 7.81728 9.50381C7.78124 9.48757 7.80034 9.43501 7.80019 9.3987C7.79933 8.05825 7.79904 6.7178 7.79933 5.37735C7.79933 5.03779 7.79933 4.69823 7.79933 4.35868C7.79933 4.24759 7.79646 4.24238 7.6942 4.22751C7.34448 4.17679 6.99332 4.17511 6.64173 4.19855C6.55829 4.20422 6.47455 4.20468 6.3914 4.21847C6.28957 4.23564 6.27966 4.24422 6.27951 4.35393C6.27951 5.22458 6.27927 6.09523 6.2788 6.96588C6.2788 7.43568 6.2775 7.90548 6.2798 8.37559C6.28119 8.4109 6.27535 8.44612 6.26267 8.47878C6.25 8.51144 6.2308 8.54075 6.20641 8.56468C5.9252 8.86026 5.64628 9.15936 5.36693 9.45632C5.34798 9.47639 5.33117 9.51761 5.30087 9.50229C5.27344 9.48834 5.2865 9.44651 5.2865 9.41724C5.28593 7.84694 5.28593 6.27671 5.2865 4.70651C5.2865 4.50854 5.28722 4.51038 5.11258 4.58653C4.64856 4.78841 4.21646 5.06532 3.83146 5.40754C3.27564 5.89658 2.82428 6.5068 2.50769 7.19725C2.23934 7.77794 2.07379 8.40651 2.01937 9.05133C1.95948 9.7571 2.01535 10.4526 2.2134 11.1331C2.41263 11.8235 2.74106 12.4637 3.17884 13.0148C3.63843 13.595 4.19066 14.0506 4.82806 14.3938C5.32184 14.6597 5.84592 14.8092 6.3868 14.9006C6.55713 14.9284 6.72924 14.9418 6.90154 14.9409C8.57188 14.9394 10.2423 14.9394 11.9128 14.9409C11.9512 14.9409 12.0085 14.9182 12.0241 14.9612C12.0398 15.0043 11.9838 15.0297 11.9564 15.0592C11.6937 15.342 11.4277 15.6217 11.1664 15.9068C11.104 15.975 11.0392 15.9988 10.951 15.9988C8.04071 15.9967 5.13053 15.9961 2.22044 15.9971C1.8543 15.9971 1.48816 15.9971 1.12201 15.9971C1.09702 15.9971 1.06169 16.0099 1.04949 15.9817C1.03728 15.9536 1.07103 15.9347 1.08841 15.916C1.37048 15.614 1.65414 15.3135 1.93492 15.0103C1.95602 14.9863 1.98175 14.9676 2.01031 14.9553C2.03888 14.943 2.06961 14.9374 2.10037 14.939C2.59099 14.9409 3.08161 14.9401 3.57222 14.939C3.60339 14.9398 3.63513 14.9471 3.67865 14.9211Z"
                      fill="#484848"
                      stroke="#484848"
                      strokeWidth="0.5"
                    />
                  </svg>
                </span>
                <span className="smallText"> {t("totalRent")}</span>
              </div>
            </div>
          </div>
        </a>
      </Link>
    </>
  );
};

export default HouseCard2;