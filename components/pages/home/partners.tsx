import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const Partners = () => {
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
        <img src="./imgs/kavk 1.png" />
        <h5 className="sliderTitle">კავკასიის საერთაშორისო უნივერსიტეტი</h5>
      </SwiperSlide>
      <SwiperSlide>
        <img src="./imgs/tv 1.png" />
        <h5 className="sliderTitle">დ.ტვილდიანის სამედიცინო უნივერსიტეტი</h5>
      </SwiperSlide>
      <SwiperSlide>
        <img src="./imgs/Untitled-1ს 1.png" />
        <h5 className="sliderTitle">შავი ზღვის საერთაშორისო უნივერსიტეტი</h5>
      </SwiperSlide>
      <SwiperSlide>
        <img src="./imgs/sam 1.png" />
        <h5 className="sliderTitle">
          თბილისის სახელმწიფო სამედიცინო უნივერსიტეტი
        </h5>
      </SwiperSlide>
      <SwiperSlide>
        <img src="./imgs/kavk 1.png" />
        <h5 className="sliderTitle">კავკასიის საერთაშორისო უნივერსიტეტი</h5>
      </SwiperSlide>
      <SwiperSlide>
        <img src="./imgs/tv 1.png" />
        <h5 className="sliderTitle">დ.ტვილდიანის სამედიცინო უნივერსიტეტი</h5>
      </SwiperSlide>
      <SwiperSlide>
        <img src="./imgs/Untitled-1ს 1.png" />
        <h5 className="sliderTitle">შავი ზღვის საერთაშორისო უნივერსიტეტი</h5>
      </SwiperSlide>
      <SwiperSlide>
        <img src="./imgs/sam 1.png" />
        <h5 className="sliderTitle">
          თბილისის სახელმწიფო სამედიცინო უნივერსიტეტი
        </h5>
      </SwiperSlide>
    </Swiper>
  );
};

export default Partners;
