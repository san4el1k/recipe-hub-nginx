// import React, {useState} from 'react';
// import {Swiper, SwiperSlide} from 'swiper/react';
// import 'swiper/css';
// import 'swiper/css/free-mode';
// import 'swiper/css/navigation';
// import 'swiper/css/thumbs';
// import './swiper.css';
// import {Navigation, Thumbs, FreeMode} from 'swiper/modules';
//
// const Carousel = ({images}) => {
//     const [lightbox, setLightbox] = useState(null);
//     const [thumbsSwiper, setThumbsSwiper] = useState(null);
//
//     return (
//         <>
//             <Swiper
//                 style={{
//                     '--swiper-navigation-color': '#fff',
//                     '--swiper-pagination-color': '#fff',
//                 }}
//                 slidesPerView={1}
//                 spaceBetween={10}
//                 navigation
//                 thumbs={{swiper: thumbsSwiper}}
//                 modules={[FreeMode, Thumbs, Navigation]}
//             >
//                 {images.map((img, index) => (
//                     <SwiperSlide key={index}>
//                         <img
//                             src={img}
//                             alt={`slide-${index}`}
//                             className="rounded-3xl md:rounded-xl cursor-pointer transition-all hover:scale-105 "
//                             onClick={() => setLightbox(img)}
//                         />
//                     </SwiperSlide>
//                 ))}
//
//                 {lightbox && (
//                     <div
//                         className="fixed inset-0 bg-gray-400/70 flex items-center justify-center z-50 p-4"
//                         onClick={() => setLightbox(null)}
//                     >
//                         <img
//                             src={lightbox}
//                             alt="full"
//                             className="max-w-full max-h-full rounded-3xl cursor-pointer"
//                         />
//                     </div>
//                 )}
//             </Swiper>
//
//             <Swiper
//                 onSwiper={setThumbsSwiper}
//                 spaceBetween={10}
//                 slidesPerView={4}
//                 freeMode={true}
//                 watchSlidesProgress={true}
//                 modules={[FreeMode, Navigation, Thumbs]}
//                 className="mySwiper"
//             >
//                 {images.map((img, index) => (
//                     <SwiperSlide key={index}>
//                         <img
//                             src={img}
//                             alt={`slide-${index}`}
//                             className="rounded-3xl md:rounded-xl cursor-pointer transition-all hover:scale-105 "
//                             onClick={() => setLightbox(img)}
//                         />
//                     </SwiperSlide>
//                 ))}
//
//                 {lightbox && (
//                     <div
//                         className="fixed inset-0 bg-gray-400/70 flex items-center justify-center z-50 p-4"
//                         onClick={() => setLightbox(null)}
//                     >
//                         <img
//                             src={lightbox}
//                             alt="full"
//                             className="max-w-full max-h-full rounded-3xl cursor-pointer"
//                         />
//                     </div>
//                 )}
//             </Swiper>
//         </>
//     );
// };
//
// export default Carousel;


import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/thumbs';
import 'swiper/css/pagination'
import './swiper.css';

import {FreeMode, Pagination, Thumbs} from 'swiper/modules';

export default function App({ images }) {
    const [lightbox, setLightbox] = useState(null);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    return (
        <div className="flex lg:gap-0 md:gap-4 gap-2 items-start w-full h-full">
            {/* ВЕРТИКАЛЬНЫЕ миниатюры */}
            <Swiper
                onSwiper={setThumbsSwiper}
                direction="vertical"
                spaceBetween={10}
                slidesPerView={'auto'}
                freeMode
                watchSlidesProgress
                modules={[FreeMode, Thumbs]}
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
                            className="rounded-3xl cursor-pointer max-h-[671px] max-w-full md:max-h-[450px] lg:max-h-[436px]"
                            onClick={() => setLightbox(img)}
                        />
                    </SwiperSlide>
                ))}

                {/* Лайтбокс */}
                {lightbox && (
                    <div
                        className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                        onClick={() => setLightbox(null)}
                    >
                        <img
                            src={lightbox}
                            alt="full"
                            className="max-w-full max-h-full rounded-3xl cursor-pointer"
                        />
                    </div>
                )}
            </Swiper>
        </div>
    );
}
