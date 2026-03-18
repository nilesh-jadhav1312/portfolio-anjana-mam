import React, { useContext, useEffect, useRef, useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import Sidebar from "../../components/admin/Sidebar";
import api from "../../services/api";
import { AuthContext } from "../../context/AuthContext";

import ManageProfile from "./ManageProfile";
import ManageCertificates from "./ManageCertificates";
import ManageResearch from "./ManageResearch";
import ManageInteractions from "./ManageInteractions";
import ManageCreativity from "./ManageCreativity";
import ManageGallery from "./ManageGallery";
import ManageMessages from "./ManageMessages";
import ManageTeaching from "./ManageTeaching";
import ManageContactInfo from "./ManageContactInfo";
import ManageAdminCredentials from "./ManageAdminCredentials";

const Overview = () => {
  const [stats, setStats] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      const cards = [
        {
          key: "certificates",
          label: "Certificates",
          endpoint: "/certificates",
          path: "/admin/certificates",
        },
        {
          key: "research",
          label: "Research",
          endpoint: "/research",
          path: "/admin/research",
        },
        {
          key: "interactions",
          label: "Interactions",
          endpoint: "/interactions",
          path: "/admin/interactions",
        },
        {
          key: "creativity",
          label: "Creativities",
          endpoint: "/creativity",
          path: "/admin/creativity",
        },
        {
          key: "gallery",
          label: "Gallery",
          endpoint: "/gallery",
          path: "/admin/gallery",
        },
        {
          key: "teaching",
          label: "Teaching",
          endpoint: "/teaching",
          path: "/admin/teaching",
        },
        {
          key: "messages",
          label: "Messages",
          endpoint: "/contact",
          path: "/admin/messages",
        },
        {
          key: "profile",
          label: "Profile",
          endpoint: "/profile",
          path: "/admin/profile",
          single: true,
        },
        {
          key: "contactInfo",
          label: "Contact Info",
          endpoint: "/contact-info",
          path: "/admin/contact-info",
          single: true,
        },
      ];

      const results = await Promise.allSettled(
        cards.map(async (card) => {
          const { data } = await api.get(card.endpoint);
          const count = Array.isArray(data) ? data.length : data ? 1 : 0;
          return { ...card, count };
        }),
      );

      if (!isMounted) return;

      const resolved = results.map((result, index) => {
        if (result.status === "fulfilled") return result.value;
        return { ...cards[index], count: 0 };
      });

      setStats(resolved);
    };

    loadStats();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="bg-[#ded6cc] border-l-4 border border-b-4 border-[#857567] text-dark-base p-8 rounded-xl shadow-lg min-h-[80vh]">
      <div className="text-center mb-10">
        <h1 className="text-5xl font-bold mb-4" style={{ color: "#857567" }}>
          Dashboard Overview
        </h1>
        <p className="text-xl max-w-2xl text-gray-700 mx-auto">
          Welcome to your portfolio admin panel. Select an option from the
          sidebar to manage your content. Changes made here will instantly
          reflect on the main website.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((item) => (
          <div
            key={item.key}
            className="bg-white rounded-xl p-6 border border-[#857567]/30 shadow-sm flex flex-col gap-4"
          >
            <div>
              <p className="text-sm uppercase tracking-widest text-[#857567] font-bold">
                {item.label}
              </p>
              <div className="text-4xl font-bold text-[#5a5047] mt-2">
                {item.count}
              </div>
            </div>
            <Link
              to={item.path}
              className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-[#5a5047] text-[#f3eee6] font-bold"
            >
              Manage {item.label}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

const DashboardLayout = () => {
  const { logout } = useContext(AuthContext);
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return undefined;
    }

    return () => {
      logout({ silent: true });
    };
  }, [logout]);

  return (
    <div className="min-h-screen bg-dark-base text-light-text flex font-sans">
      <Sidebar />
      <div className="flex-1 ml-64 p-8 overflow-y-auto h-screen relative">
        <div className="max-w-6xl mx-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/teaching" element={<ManageTeaching />} />
            <Route path="/profile" element={<ManageProfile />} />
            <Route path="/certificates" element={<ManageCertificates />} />
            <Route path="/research" element={<ManageResearch />} />
            <Route path="/interactions" element={<ManageInteractions />} />
            <Route path="/creativity" element={<ManageCreativity />} />
            <Route path="/gallery" element={<ManageGallery />} />
            <Route path="/messages" element={<ManageMessages />} />
            <Route path="/contact-info" element={<ManageContactInfo />} />
            <Route path="/credentials" element={<ManageAdminCredentials />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
