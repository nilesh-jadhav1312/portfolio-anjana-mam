import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "Courses", href: "/courses" },
    { name: "Certification", href: "/certification" },
    { name: "Research", href: "/research" },
    { name: "Interactions", href: "/interactions" },
    { name: "Creativity", href: "/creativity" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      if (location.pathname === "/") {
        const sections = navLinks
          .map((link) => link.href.replace("/#", ""))
          .filter(
            (id) =>
              id &&
              id !== "certification" &&
              id !== "courses" &&
              id !== "research" &&
              id !== "interactions" &&
              id !== "creativity" &&
              id !== "gallery",
          );

        let current = "";
        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const rect = element.getBoundingClientRect();
            // A section is active if its top is above the viewport middle (or slightly below header)
            if (rect.top <= 150 && rect.bottom >= 150) {
              current = section;
              break;
            }
          }
        }
        if (current) setActiveSection(current);
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [location.pathname]);

  useEffect(() => {
    if (location.pathname === "/certification") {
      setActiveSection("certification");
    } else if (location.pathname === "/courses") {
      setActiveSection("courses");
    } else if (location.pathname === "/research") {
      setActiveSection("research");
    } else if (location.pathname === "/interactions") {
      setActiveSection("interactions");
    } else if (location.pathname === "/creativity") {
      setActiveSection("creativity");
    } else if (location.pathname === "/gallery") {
      setActiveSection("gallery");
    } else {
      setActiveSection(location.hash.replace("#", "") || "home");
    }
  }, [location.pathname, location.hash]);

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);

    if (
      href === "/certification" ||
      href === "/courses" ||
      href === "/research" ||
      href === "/interactions" ||
      href === "/creativity" ||
      href === "/gallery"
    ) {
      navigate(href);
      return;
    }

    const targetId = href.replace("/#", "");

    if (location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          const offsetTop =
            element.getBoundingClientRect().top + window.scrollY - 80;
          window.scrollTo({
            top: offsetTop,
            behavior: "smooth",
          });
        }
      }, 100);
      return;
    }

    const element = document.getElementById(targetId);
    if (element) {
      const offsetTop =
        element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      });
    }
  };

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-light-text/70 backdrop-blur-sm shadow-md py-3" : "bg-light-text/70 py-5"}`}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-8 flex justify-between items-center">
        <a
          href="#home"
          onClick={(e) => handleScrollTo(e, "#home")}
          className="text-2xl font-bold tracking-wider text-black relative group overflow-hidden"
        >
          <span className="relative z-10">Dr. Anjana Arakerimath</span>
          <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 lg:gap-8 items-center">
          {navLinks.map((link) => {
            const targetId = link.href.replace("/#", "").replace("/", "");
            const isActive = activeSection === targetId;

            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className={`text-sm uppercase tracking-wider font-bold transition-all duration-200 py-1 ${
                  isActive
                    ? "text-[#5a5047] border-b-2 border-[#5a5047] mb-2"
                    : "text-[#f3eee6] hover:text-[#5a5047]"
                }`}
              >
                {link.name}
                {/* Active Underline hover handled by custom border for active */}
                {!isActive && (
                  <span className="absolute left-0 bottom-0 w-full h-0.5 bg-[#857567] transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></span>
                )}
              </a>
            );
          })}
        </nav>

        {/* Mobile Hamburger toggle */}
        <button
          className="md:hidden text-light-text p-2 focus:outline-none"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu Slide In */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-64 bg-dark-base shadow-2xl flex flex-col pt-20 px-6 md:hidden border-l border-[#857567]/30"
          >
            {navLinks.map((link) => {
              const targetId = link.href.replace("/#", "").replace("/", "");
              const isActive = activeSection === targetId;

              return (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScrollTo(e, link.href)}
                  className={`text-xl uppercase tracking-widest font-bold py-4 border-b border-black transition-colors ${
                    isActive
                      ? "text-[#5a5047]"
                      : "text-[#857567] hover:text-[#5a5047]"
                  }`}
                >
                  {link.name}
                </a>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
