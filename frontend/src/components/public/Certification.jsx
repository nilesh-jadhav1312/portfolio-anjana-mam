import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, X } from "lucide-react";
import api from "../../services/api";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const Certification = () => {
  const [certificates, setCertificates] = useState([]);
  const [visibleCount, setVisibleCount] = useState(6);
  const [selectedCert, setSelectedCert] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const { data } = await api.get("/certificates");
        setCertificates(data);
      } catch (error) {
        console.error("Failed to load certificates");
      }
    };
    fetchCertificates();
  }, []);

  if (!certificates || certificates.length === 0) return null;

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 6);
  };

  return (
    <section
      id="elearning"
      className="min-h-screen py-6 bg-dark-base px-5 md:px-10 lg:px-20   relative"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto flex flex-col items-center">
        <h2
          
          className="text-4xl md:text-5xl font-bold leading-tight mb-4 tracking-wider text-center"
          style={{ color: "#5a5047" }}
        >
          CERTIFICATIONS
        </h2>
        <motion.div
           
          className="h-1 bg-[#a99888] mb-16 rounded-full"
        ></motion.div>

        <div className=" grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full z-10">
          {certificates.slice(0, visibleCount).map((cert, index) => (
            <motion.div
              key={cert._id}
              whileHover={{ y: -10 }}
              className="bg-[#ded6cc] rounded-2xl p-8 shadow-lg hover:shadow-[0_10px_30px_rgba(133,117,103,0.3)] transition-all flex flex-col justify-between group border-b-4 border-transparent border-[#5a5047] hover:border-[#857567] relative overflow-hidden"
            >
              {cert.certificateFile && (
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                  style={{
                    backgroundImage: `url(${resolveMediaUrl(
                      cert.certificateFile,
                    )})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    mixBlendMode: "multiply",
                  }}
                ></div>
              )}
              <div className="relative z-10">
              <div >
                <div className="w-12 h-12 rounded-full bg-[#5a5047] text-[#f3eee6] flex justify-center items-center mb-6 group-hover:scale-110 transition-transform">
                  <Award size={24} />
                </div>
                <h3 className="text-2xl font-bold text-[#5a5047] mb-2 leading-snug">
                  {cert.title}
                </h3>
                <p className="text-sm font-semibold text-gray-800 mb-6">
                  {cert.platform} | {cert.year}
                </p>
              </div>

              {cert.certificateFile ? (
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="block text-center w-full py-3 border border-[#857567] text-light-text font-bold rounded-full bg-[#a99888] hover:bg-[#857567] hover:text-[#f3eee6] transition-colors"
                >
                  View Certificate
                </button>
              ) : (
                <button
                  disabled
                  className="block text-center w-full py-3 border border-gray-300 text-gray-500 font-bold rounded-full bg-gray-200 cursor-not-allowed"
                >
                  No Certificate Uploaded
                </button>
              )}
              </div>
            </motion.div>
          ))}
        </div>

        {visibleCount < certificates.length && (
          <motion.button
             
            onClick={handleViewMore}
            className="mt-16 px-10 py-4 bg-[#857567] text-white rounded-full font-bold tracking-wide hover:bg-[#a99888] hover:shadow-[0_0_20px_rgba(133,117,103,0.4)] transition-all duration-300 transform hover:-translate-y-1 z-10 focus:outline-none"
          >
            Load More Certifications
          </motion.button>
        )}

        {/* Certificate Modal Overlay */}
        {selectedCert && (
          <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setSelectedCert(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative max-w-5xl w-full max-h-[90vh] bg-white/5 rounded-2xl overflow-hidden shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-4 right-4 z-50 p-2 bg-black/60 text-white rounded-full hover:bg-black/90 transition-all border border-white/20"
                onClick={() => setSelectedCert(null)}
              >
                <X size={24} />
              </button>
              
              <div className="flex-1 overflow-auto p-2 md:p-4 flex items-center justify-center">
                <img 
                  src={resolveMediaUrl(selectedCert.certificateFile)} 
                  alt={selectedCert.title}
                  className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
                />
              </div>

              <div className="bg-black/60 backdrop-blur-md p-6 text-center border-t border-white/10">
                <h4 className="text-white font-bold text-xl mb-1">{selectedCert.title}</h4>
                <p className="text-gray-300 text-base">{selectedCert.platform} | {selectedCert.year}</p>
                <a
                  href={resolveMediaUrl(selectedCert.certificateFile)}
                  download
                  className="inline-block mt-4 px-6 py-2 bg-white/10 text-white rounded-full text-sm font-semibold hover:bg-white/20 transition-colors"
                >
                  Download Original
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Certification;
