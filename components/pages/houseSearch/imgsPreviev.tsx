import React, { useState } from "react";
import classnames from "classnames";

interface IProps {
  images: { original: string; thumb: string }[];
}

const ImgPreview: React.FC<IProps> = ({ images }) => {
  const [currentId, setCurrentId] = useState(0);

  return (
    <div className="ImgPreview_container">
      {images.map((el, i) => {
        return (
          <img
            key={i}
            className={classnames("sliderImg", {
              active: i === currentId,
            })}
            src={el.thumb}
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

export default ImgPreview;
