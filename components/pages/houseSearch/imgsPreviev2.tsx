import React, { useState } from "react";
import classnames from "classnames";
import Image from "next/image";

interface IProps {
  images: string[];
}

const ImgPreview2: React.FC<IProps> = ({ images }) => {
  const [currentId, setCurrentId] = useState(0);

  return (
    <div className="ImgPreview_container">
      {images.map((el, i) => {
        return (
          <Image
            objectFit="cover"
            layout="fill"
            key={i}
            className={classnames("sliderImg", {
              active: i === currentId,
            })}
            src={el}
          />
        );
      })}
      <img
        onClick={(e) => {
          e.preventDefault();

          if (currentId > 0) {
            setCurrentId(currentId - 1);
          }
        }}
        className="leftArr"
        src="/imgs/sliderLeftArrow.svg"
      />
      <img
        onClick={(e) => {
          e.preventDefault();

          if (images.length - 1 > currentId) {
            setCurrentId(currentId + 1);
          }
        }}
        className="rightArr"
        src="/imgs/sliderLeftArrow.svg"
      />

      <div className="sliderBullets">
        {images.map((el, i) => {
          return (
            <div
              key={i}
              onClick={(e) => {
                e.preventDefault();
                setCurrentId(i);
              }}
              className={classnames("dot", {
                active: i === currentId,
              })}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ImgPreview2;
