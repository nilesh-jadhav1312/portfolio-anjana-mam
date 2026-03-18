import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, EffectFade } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import api from "../../services/api";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const Creativity = () => {
  const [slides, setSlides] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const { data } = await api.get("/creativity");
        setSlides(data);
      } catch (error) {
        console.error("Failed to load creativity slides");
      }
    };
    fetchSlides();
  }, []);

  const sortedSlides = [...slides].sort(
    (a, b) => new Date(b.date || 0) - new Date(a.date || 0),
  );

  const openModal = (index) => {
    setCurrentIndex(index);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    document.body.style.overflow = "auto";
  };

  const nextImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === sortedSlides.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? sortedSlides.length - 1 : prev - 1,
    );
  };

  if (!slides || slides.length === 0) return null;

  return (
    <section
      id="creativity"
      className="min-h-screen py-8 bg-[#ded6cc] px-0  relative"
    >
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-wider text-[#5a5047] mb-2">
            MY CREATIVITY
          </h2>
          <div className="h-1 w-24 bg-[#857567] mx-auto rounded-full"></div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="w-full relative shadow-[0_20px_50px_rgba(90,80,71,0.3)] bg-dark-base"
      >
        {/* Custom styling overriding Swiper defaults for the theme */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
                    .swiper-button-next, .swiper-button-prev { color: #ff3700ff !important; text-shadow: 0 0 10px rgba(0,0,0,0.5); }
                    .swiper-pagination-bullet { background: #857567!important; opacity: 0.5; width: 10px; height: 10px; }
                    .swiper-pagination-bullet-active { background: #857567 !important; transform: scale(1.3); opacity: 1; }
                `,
          }}
        />

        <Swiper
          modules={[Autoplay, Navigation, Pagination]}
          spaceBetween={30}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          navigation
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{
            delay: 1000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          className="w-full pb-12"
        >
          {sortedSlides.map((slide, index) => (
            <SwiperSlide key={slide._id} className="h-auto">
              <div
                className="bg-[#ded6cc] rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_10px_30px_rgba(133,117,103,0.3)] transition-all h-full flex flex-col group border-b-4 border-transparent hover:border-[#857567] mb-10 cursor-pointer"
                onClick={() => openModal(index)}
              >
                <div className="relative w-full h-[300px] overflow-hidden bg-dark-base">
                  <img
                    src={resolveMediaUrl(slide.image)}
                    alt={slide.title}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="bg-black/50 p-2 rounded-full backdrop-blur-sm">
                      <Maximize2 size={18} className="text-white" />
                    </div>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 bg-[#ded6cc]">
                  <span className="inline-block px-3 py-1 bg-[#857567] text-[#f3eee6] text-xs font-bold rounded-full mb-3 shadow-md w-max">
                    {slide.date}
                  </span>
                  <h3 className="text-2xl font-bold text-[#5a5047] mb-3 leading-snug">
                    {slide.title}
                  </h3>
                  {slide.description && (
                    <p className="text-gray-700 text-sm leading-relaxed flex-1">
                      {slide.description}
                    </p>
                  )}
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {modalOpen && sortedSlides[currentIndex] && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 md:p-10 backdrop-blur-sm"
            onClick={closeModal}
          >
            {/* Close btn */}
            <button
              className="absolute top-6 right-6 text-gray-400 hover:text-white p-2 focus:outline-none z-[110]"
              onClick={closeModal}
            >
              <X size={36} />
            </button>

            {/* Prev btn */}
            <button
              className="absolute left-4 md:left-10 text-gray-400 hover:text-white p-4 focus:outline-none z-[110]"
              onClick={prevImage}
            >
              <ChevronLeft size={48} />
            </button>

            {/* Content */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative max-w-5xl max-h-full flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={resolveMediaUrl(sortedSlides[currentIndex].image)}
                alt={sortedSlides[currentIndex].title}
                className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-sm"
              />
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">
                  {sortedSlides[currentIndex].title}
                </h3>
                <p className="text-[#a99888] tracking-widest uppercase text-sm font-bold">
                  {sortedSlides[currentIndex].date}
                </p>
                {sortedSlides[currentIndex].description && (
                  <p className="mt-4 text-[#ded6cc] text-sm max-w-2xl mx-auto">
                    {sortedSlides[currentIndex].description}
                  </p>
                )}
              </div>
            </motion.div>

            {/* Next btn */}
            <button
              className="absolute right-4 md:right-10 text-gray-400 hover:text-white p-4 focus:outline-none z-[110]"
              onClick={nextImage}
            >
              <ChevronRight size={48} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default Creativity;
