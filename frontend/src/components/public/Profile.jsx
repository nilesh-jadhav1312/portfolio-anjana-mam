import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import api from "../../services/api";
import { resolveMediaUrl } from "../../utils/mediaUrl";

const InfoCard = ({ title, items }) => {
  const [expanded, setExpanded] = useState(false);
  if (!items || items.length === 0) return null;

  // Show max 3 items unless expanded
  const displayItems = expanded ? items : items.slice(0, 3);
  const showReadMore = items.length > 3;

  return (
    <div className="bg-[#ded6cc] text-dark-base p-6 rounded-2xl shadow-lg border-l-4 border-[#857567] flex flex-col h-full transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <h3 className="text-xl font-bold mb-4 text-[#857567] border-b pb-2 border-[#a99888]/30">
        {title}
      </h3>
      <ul className="list-disc pl-4 space-y-2 flex-grow text-gray-800">
        {displayItems.map((item, idx) => (
          <li key={idx} className="text-sm md:text-base leading-snug">
            {item}
          </li>
        ))}
      </ul>
      {showReadMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 text-[#857567] font-bold text-sm hover:text-[#5a5047] transition-colors self-start uppercase tracking-wider"
        >
          {expanded ? "Read Less" : "Read More..."}
        </button>
      )}
    </div>
  );
};

const Profile = () => {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const { data } = await api.get("/profile");
        setProfile(data);
      } catch (error) {
        console.error("Error loading profile", error);
      }
    };
    loadProfile();
  }, []);

  if (!profile) return null;

  return (
    <section
      id="profile"
      className="min-h-screen  bg-dark-base px-5 md:px-10 lg:px-20 relative"
    >
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-light-text mb-2 text-center"
        >
          ABOUT ME
        </motion.h2>
        <div className="h-1 w-24 bg-[#857567] mx-auto rounded-full mb-20"></div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left: Image & CV button */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-4 flex flex-col items-center"
          >
            <div className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-[#857567] shadow-xl shadow-[#857567]/20 relative group">
              <img
                src={
                  profile.profileImage
                    ? resolveMediaUrl(profile.profileImage)
                    : "/placeholder-profile.jpg"
                }
                alt={profile.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </div>
            {profile.cvFile && (
              <a
                href={resolveMediaUrl(profile.cvFile)}
                target="_blank"
                rel="noreferrer"
                className="mt-8 flex items-center gap-3 px-8 py-3 bg-transparent border-2 border-[#857567] text-light-text hover:bg-[#857567] hover:text-white rounded-full font-bold tracking-wider transition-all duration-300 hover:shadow-[0_0_15px_#857567]"
              >
                <Download size={20} />
                VIEW CV
              </a>
            )}
          </motion.div>

          {/* Right: Bio & Info */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-8 space-y-10"
          >
            {/* Bio */}
            <div className="border-b-3 border-l-3 border-[#a99888] bg-[#ded6cc] text-dark-base p-8 rounded-2xl shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-20 h-20 bg-[#a99888] scale-150 rotate-45 transform translate-x-10 -translate-y-10 opacity-20"></div>
              <h3 className="text-2xl font-bold mb-4 text-[#5a5047]">
                Who am I ?
              </h3>
              <p className="text-lg text-light-text leading-relaxed">
                {profile.bio ||
                  "Hello! I am a passionate individual dedicated to exploring new ideas."}
              </p>
            </div>
          </motion.div>
        </div>

        {/* 3 Horizontal Cards for Experience, Education, Memberships */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16"
        >
          <InfoCard title="Work Experience" items={profile.workExperience} />
          <InfoCard title="Education" items={profile.educationDetails} />
          <InfoCard
            title="Memberships"
            items={profile.professionalMemberships}
          />
        </motion.div>
      </div>
    </section>
  );
};

export default Profile;
