import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Search, BookOpen } from "lucide-react";
import api from "../../services/api";

const Research = () => {
  const [researchList, setResearchList] = useState([]);
  const [filteredList, setFilteredList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedId, setExpandedId] = useState(null);
  const [years, setYears] = useState([]);
  const [activeYear, setActiveYear] = useState("All");
  const [visibleCount, setVisibleCount] = useState(3);

  useEffect(() => {
    const fetchResearch = async () => {
      try {
        const { data } = await api.get("/research");
        setResearchList(data);
        setFilteredList(data);

        const uniqueYears = [
          "All",
          ...new Set(data.map((item) => item.year).sort((a, b) => b - a)),
        ];
        setYears(uniqueYears);
      } catch (error) {
        console.error("Failed to load research");
      }
    };
    fetchResearch();
  }, []);

  useEffect(() => {
    let result = researchList;
    if (activeYear !== "All") {
      result = result.filter((item) => item.year === activeYear);
    }
    if (searchTerm) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.tags &&
            item.tags.some((tag) =>
              tag.toLowerCase().includes(searchTerm.toLowerCase()),
            )),
      );
    }
    setFilteredList(result);
  }, [activeYear, searchTerm, researchList]);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleViewMore = () => {
    setVisibleCount((prev) => prev + 3);
  };

  if (!researchList || researchList.length === 0) return null;

  return (
    <section
      id="research"
      className="min-h-screen py-12 bg-dark-base px-5 md:px-10 lg:px-20 relative"
    >
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto">
        <motion.div
           
          className="flex flex-col md:flex-row justify-center items-center mb-16"
        >
          <div className="w-full justify-center flex flex-col items-center">
            <h2 className="text-4xl md:text-5xl font-bold tracking-wider text-[#5a5047]">
              RESEARCH WORK
            </h2>
            <div className="h-1 w-24 bg-[#a99888] mt-4 rounded-full"></div>
          </div>
        </motion.div>

        {/* Google Scholar Banner */}
        <motion.div
           
          className="bg-white/40 border-2 border-[#857567]/30 rounded-2xl p-6 md:p-8 mb-16 flex flex-col md:flex-row items-center justify-between gap-6 shadow-md hover:shadow-lg transition-all"
        >
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#857567] shrink-0">
              <img
                src="https://scholar.googleusercontent.com/citations?view_op=view_photo&user=Sgd9lfcAAAAJ&citpid=1"
                alt="Dr. Anjana R Arakerimath"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/150?text=Profile";
                }}
              />
            </div>
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Google_Scholar_logo.svg"
                  alt="Google Scholar"
                  className="w-6 h-6"
                />
                <h3 className="text-2xl font-bold text-[#5a5047]">
                  Google Scholar Profile
                </h3>
              </div>
              <p className="text-[#857567] font-semibold text-lg">
                Dr. Anjana R Arakerimath
              </p>
            </div>
          </div>

          <a
            href="https://scholar.google.co.in/citations?user=Sgd9lfcAAAAJ&hl=en"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 px-8 py-3 bg-[#5a5047] text-[#f3eee6] rounded-full font-bold hover:bg-[#857567] hover:shadow-md transition-all shrink-0"
          >
            Visit Profile <BookOpen size={18} />
          </a>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <motion.div
            
            className="flex flex-wrap gap-2"
          >
            {years.map((year) => (
              <button
                key={year}
                onClick={() => setActiveYear(year)}
                className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                  activeYear === year
                    ? "bg-[#5a5047] text-white shadow-md border border-[#5a5047]"
                    : "bg-transparent border border-[#857567] text-[#5a5047] hover:bg-[#857567]/10"
                }`}
              >
                {year}
              </button>
            ))}
          </motion.div>

          <div className="w-full md:w-auto relative group">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search papers/tags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full md:w-72 bg-white/50 border border-[#857567]/50 rounded-full py-3 pl-10 pr-4 text-black placeholder-gray-500 focus:outline-none focus:border-[#5a5047] focus:bg-white transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full z-10">
          <AnimatePresence>
            {filteredList.slice(0, visibleCount).map((item, index) => (
              <motion.div
                key={item._id}
                 
                className="bg-[#ded6cc] rounded-2xl p-8 shadow-lg hover:shadow-[0_10px_30px_rgba(133,117,103,0.3)] transition-all flex flex-col justify-between group border-b-4 border-transparent border-[#5a5047] hover:border-[#857567]"
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-12 h-12 rounded-full bg-[#5a5047] text-[#f3eee6] flex justify-center items-center group-hover:scale-110 transition-transform">
                      <BookOpen size={24} />
                    </div>
                    <span className="bg-[#857567] text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm">
                      {item.year}
                    </span>
                  </div>

                  <h3 className="text-2xl font-bold text-[#5a5047] mb-3 leading-snug">
                    {item.title}
                  </h3>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {(item.tags || []).map((tag, i) => (
                      <span
                        key={i}
                        className="text-xs font-bold text-[#5a5047] bg-[#a99888]/30 px-2 py-1 rounded-md"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>

                  <p className="text-sm text-black mb-6 leading-relaxed line-clamp-5">
                    {item.abstract}
                  </p>
                </div>

                <div className="flex flex-col gap-3 mt-4">
                  {item.link && (
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noreferrer"
                      className="block text-center w-full py-3 border border-[#857567] text-light-text font-bold rounded-full bg-[#a99888] hover:bg-[#857567] hover:text-[#f3eee6] transition-colors"
                    >
                      Visit Research Link
                    </a>
                  )}
                  {item.pdfFile && (
                    <a
                      href={item.pdfFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`block text-center w-full py-3 border border-[#857567] font-bold rounded-full transition-colors ${
                        item.link
                          ? "text-[#5a5047] bg-transparent hover:bg-[#857567] hover:text-[#f3eee6]"
                          : "text-light-text bg-[#857567] hover:bg-[#a99888]"
                      }`}
                    >
                      <span className="flex items-center justify-center gap-2">
                        <FileText size={18} /> View PDF Link
                      </span>
                    </a>
                  )}
                  {/* {item.pdfFile && (
                    <>
                      <a
                        href={resolveMediaUrl(item.pdfFile)}
                        target="_blank"
                        rel="noreferrer"
                        className={`block text-center w-full py-3 border border-[#857567] font-bold rounded-full transition-colors ${
                          item.link
                            ? "text-[#5a5047] bg-transparent hover:bg-[#857567] hover:text-[#f3eee6]"
                            : "text-light-text bg-[#857567] hover:bg-[#a99888]"
                        }`}
                      >
                        <span className="flex items-center justify-center gap-2">
                          <FileText size={18} /> View PDF
                        </span>
                      </a>
                       
                    </>
                  )} */}
                  {!item.link && !item.pdfFile && (
                    <button
                      disabled
                      className="block text-center w-full py-3 border border-gray-300 text-[#5a5047] font-bold rounded-full bg-transparent cursor-not-allowed opacity-50 border-dashed"
                    >
                      Details Unavailable
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {filteredList.length === 0 && (
            <div className="text-center py-20 text-[#a99888] text-xl w-full col-span-1 md:col-span-2 lg:col-span-3">
              No research works found matching your criteria.
            </div>
          )}
        </div>

        {visibleCount < filteredList.length && (
          <div className="flex justify-center mt-12 w-full">
            <motion.button
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              onClick={handleViewMore}
              className="px-10 py-4 bg-[#857567] text-white rounded-full font-bold tracking-wide hover:bg-[#a99888] hover:shadow-[0_0_20px_rgba(133,117,103,0.4)] transition-all duration-300 transform hover:-translate-y-1 z-10 focus:outline-none"
            >
              Load More Papers
            </motion.button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Research;
