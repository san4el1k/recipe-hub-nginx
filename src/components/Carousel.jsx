import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import 'swiper/css/pagination'
import './swiper.css';

import {FreeMode, Mousewheel, Pagination, Thumbs} from 'swiper/modules';

export default function App({ images }) {
    const [lightbox, setLightbox] = useState(null);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className="flex md:gap-4 gap-2 items-start w-full h-full">
            {/* ВЕРТИКАЛЬНЫЕ миниатюры */}
            <Swiper
                onSwiper={setThumbsSwiper}
                direction="vertical"
                spaceBetween={10}
                slidesPerView={'auto'}
                freeMode
                watchSlidesProgress
                mousewheel={{
                    forceToAxis: true,
                    sensitivity: 0.7,
                    eventPassthrough: 'vertical',
                }}
                modules={[FreeMode, Thumbs, Mousewheel]}
                className="mySwiper w-[100px] max-h-full" // фиксируем высоту
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={img}
                            alt={`thumb-${index}`}
                            className="rounded-xl cursor-pointer object-cover w-full h-auto"
                        />
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* ГОРИЗОНТАЛЬНЫЙ основной слайдер */}
            <Swiper
                style={{
                    '--swiper-navigation-color': '#fff',
                    '--swiper-pagination-color': '#fff',
                }}
                spaceBetween={10}
                thumbs={{ swiper: thumbsSwiper }}
                modules={[FreeMode, Thumbs, Pagination]}
                pagination={{dynamicBullets: true}}
                className="mySwiper2 "
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <img
                            src={img}
                            alt={`slide-${index}`}
                            className={`${lightbox && 'hidden'} rounded-3xl cursor-pointer max-h-[671px] max-w-full md:max-h-[450px] lg:max-h-[436px]`}
                            onClick={() => setLightbox(img)}
                        />
                    </SwiperSlide>
                ))}

                {/* Лайтбокс */}
                {lightbox && (
                    <div
                        className="fixed inset-0 bg-black/70 flex items-center justify-center p-4"
                        onClick={() => setLightbox(null)}
                    >
                        <img
                            src={lightbox}
                            alt="full"
                            className="max-w-full max-h-full rounded-3xl cursor-pointer top-16 fixed"
                        />
                    </div>
                )}
            </Swiper>
        </div>
    );
}
