import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import api from "../../services/api";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const { data } = await api.get("/gallery");
        setImages(data);

        const cats = [
          "All",
          ...new Set(data.map((item) => item.category).filter(Boolean)),
        ];
        setCategories(cats);
      } catch (error) {
        console.error("Failed to load gallery");
      }
    };
    fetchGallery();
  }, []);

  const filteredImages =
    activeCategory === "All"
      ? images
      : images.filter((img) => img.category === activeCategory);

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
      prev === filteredImages.length - 1 ? 0 : prev + 1,
    );
  };

  const prevImage = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) =>
      prev === 0 ? filteredImages.length - 1 : prev - 1,
    );
  };

  if (!images || images.length === 0) return null;

  return (
    <section
      id="gallery"
      className="text-light-text min-h-screen py-10 bg-dark-base px-5 md:px-10 lg:px-20  relative"
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
           
          className="flex flex-col md:flex-row justify-between items-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold tracking-wider text-light-text mb-6 md:mb-0">
            GALLERY
          </h2>

          {categories.length > 1 && (
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2 rounded-full text-sm font-bold uppercase tracking-wide transition-all ${
                    activeCategory === cat
                      ? "bg-[#857567] text-white shadow-lg transform scale-105"
                      : "bg-transparent border border-[#a99888] text-light-text hover:bg-[#857567]/20 hover:border-[#857567]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </motion.div>

        {/* Slider Restyling */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
                    .swiper-button-next, .swiper-button-prev { color: #f3eee6 !important; text-shadow: 0 0 10px rgba(0,0,0,0.5); }
                `,
          }}
        />

        <Swiper
          modules={[Autoplay, Navigation]}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          navigation
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          className="w-full pb-12"
        >
          {filteredImages
            .sort((a, b) => new Date(a.date || 0) - new Date(b.date || 0))
            .map((img, index) => (
              <SwiperSlide key={img._id} className="h-auto py-6">
                <motion.div
                   
                  transition={{
                    duration: 0.5,
                    delay: (index % 4) * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                  whileHover={{ scale: 1.05, y: -10 }}
                  className="bg-[#ded6cc] rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_15px_40px_rgba(133,117,103,0.4)] transition-all h-full flex flex-col group border-b-4 border-transparent hover:border-[#857567] cursor-pointer"
                  onClick={() => openModal(index)}
                >
                  <div className="relative w-full h-48 md:h-56 overflow-hidden bg-dark-base">
                    <img
                      src={resolveMediaUrl(img.image)}
                      alt={img.caption}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300"></div>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="bg-black/50 p-2 rounded-full backdrop-blur-sm">
                        <Maximize2 size={16} className="text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="p-5 flex flex-col flex-1 bg-[#ded6cc]">
                    <span className="inline-block px-3 py-1 bg-[#857567] text-[#f3eee6] text-[10px] font-bold uppercase tracking-wider rounded-md mb-3 shadow-sm w-max">
                      {img.date || "NO DATE"}
                    </span>
                    <h3 className="text-lg font-bold text-[#5a5047] leading-snug break-words">
                      {img.caption}
                    </h3>
                  </div>
                </motion.div>
              </SwiperSlide>
            ))}
        </Swiper>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {modalOpen && filteredImages[currentIndex] && (
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
                src={resolveMediaUrl(filteredImages[currentIndex].image)}
                alt={filteredImages[currentIndex].caption}
                className="max-w-full max-h-[80vh] object-contain shadow-2xl rounded-sm"
              />
              <div className="mt-6 text-center">
                <h3 className="text-2xl font-bold text-white mb-2 tracking-wide">
                  {filteredImages[currentIndex].caption}
                </h3>
                <p className="text-[#a99888] tracking-widest uppercase text-sm font-bold">
                  {filteredImages[currentIndex].date}
                </p>
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

export default Gallery;
