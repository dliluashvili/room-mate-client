import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import useTranslation from "next-translate/useTranslation";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const Partners = () => {
  let { t } = useTranslation("common");

  return (
    <Swiper
      spaceBetween={50}
      controller={{ inverse: true }}
      loop={true}
      navigation={true}
      modules={[Navigation]}
      // autoplay={true}
      // slidesPerView={4}
      breakpoints={{
        300: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
      }}
    >
      <SwiperSlide>
        <img src="/imgs/kavk 1.png" />
        <h5 className="sliderTitle">{t("uni1")}</h5>
      </SwiperSlide>
      <SwiperSlide>
        <img src="/imgs/tv 1.png" />
        <h5 className="sliderTitle">{t("uni2")}</h5>
      </SwiperSlide>
      <SwiperSlide>
        <img src="/imgs/Untitled-1ს 1.png" />
        <h5 className="sliderTitle">{t("uni3")}</h5>
      </SwiperSlide>
      <SwiperSlide>
        <img src="/imgs/sam 1.png" />
        <h5 className="sliderTitle">{t("uni4")}</h5>
      </SwiperSlide>
      <SwiperSlide>
        <img src="/imgs/kavk 1.png" />
        <h5 className="sliderTitle">{t("uni1")}</h5>
      </SwiperSlide>
      <SwiperSlide>
        <img src="/imgs/tv 1.png" />
        <h5 className="sliderTitle">{t("uni2")}</h5>
      </SwiperSlide>
      <SwiperSlide>
        <img src="/imgs/Untitled-1ს 1.png" />
        <h5 className="sliderTitle">{t("uni3")}</h5>
      </SwiperSlide>
      <SwiperSlide>
        <img src="/imgs/sam 1.png" />
        <h5 className="sliderTitle">{t("uni4")}</h5>
      </SwiperSlide>
    </Swiper>
  );
};

export default Partners;
