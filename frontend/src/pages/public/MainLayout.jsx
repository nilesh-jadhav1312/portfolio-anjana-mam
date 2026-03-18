import React, { useEffect, useState } from "react";
import Navbar from "../../components/public/Navbar";
import Home from "../../components/public/Home";
import Profile from "../../components/public/Profile";
import OutsideInteraction from "../../components/public/OutsideInteraction";
import Creativity from "../../components/public/Creativity";
import Gallery from "../../components/public/Gallery";
import Contact from "../../components/public/Contact";
import api from "../../services/api";

const MainLayout = () => {
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const profileReq = await api.get("/profile");
        setProfileData(profileReq.data);
      } catch (error) {
        console.error("Failed fetching data", error);
      }
    };
    fetchInitialData();
  }, []);

  return (
    <div className="bg-dark-base min-h-screen text-light-text font-sans scroll-smooth">
      <Navbar />

      <main>
        <Home profileData={profileData} />
        <Profile />
        <Contact />
      </main>
    </div>
  );
};

export default MainLayout;
