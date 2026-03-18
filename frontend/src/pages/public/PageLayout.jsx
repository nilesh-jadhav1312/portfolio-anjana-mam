import React, { useEffect } from "react";
import Navbar from "../../components/public/Navbar";

const PageLayout = ({ children, noTopPadding = false }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="bg-dark-base min-h-screen text-light-text font-sans scroll-smooth">
      <Navbar />
      {/* 
        Gallery Page was just pt-20. 
        Other pages were pt-20 pb-20. 
        Allowing a flag 'noTopPadding' if needed in future, but standardizing to pt-20 pb-20 for most.
      */}
      <main className={`pt-20 ${noTopPadding ? "" : "pb-20"}`}>
        {children}
      </main>
    </div>
  );
};

export default PageLayout;
