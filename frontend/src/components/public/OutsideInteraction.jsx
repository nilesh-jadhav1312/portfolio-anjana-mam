import React, { useEffect, useState } from "react";
import { Mic, Users, Presentation } from "lucide-react";
import api from "../../services/api";

const OutsideInteraction = () => {
  const [interactions, setInteractions] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState({});

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const { data } = await api.get("/interactions");
        setInteractions(data);
      } catch (error) {
        console.error("Failed to load interactions");
      }
    };
    fetchInteractions();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "Conference":
        return <Users size={24} />;
      case "Workshop":
        return <Presentation size={24} />;
      case "Talk":
        return <Mic size={24} />;
      default:
        return <Users size={24} />;
    }
  };

  const toggleCategory = (category) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  // Do not return null when empty, let it render empty state

  return (
    <section
      id="interactions"
      className="min-h-screen py-15 bg-dark-base px-5 relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full bg-[#857567]/5 transform skew-x-12 translate-x-32 pointer-events-none"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-3xl font-bold tracking-wider text-light-text mb-0">
            OUTSIDE INTERACTIONS
          </h2>
          <p className="text-[#a99888] text-lg max-w-2xl mx-auto">
            Conferences, workshops, and speaking engagements where I share
            knowledge and collaborate with peers.
          </p>
        </div>

        <div className="grid grid-cols- md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10 w-full">
          {Object.entries(
            interactions.reduce((acc, curr) => {
              const category = curr.type || "Other";
              if (!acc[category]) acc[category] = [];
              acc[category].push(curr);
              return acc;
            }, {}),
          ).map(([category, items]) => (
            <div
              key={category}
              className="bg-[#ded6cc] rounded-2xl p-8 shadow-lg flex flex-col group border-b-4 border-[#5a5047]"
            >
              <div className="flex items-center gap-4 mb-6 pb-4 border-b border-[#857567]/30">
                <div className="w-12 h-12 rounded-full bg-[#5a5047] text-[#f3eee6] flex justify-center items-center shrink-0">
                  {getIcon(category)}
                </div>
                <h3 className="text-2xl font-bold text-[#5a5047] leading-tight">
                  {category}
                </h3>
              </div>

              <ul className="space-y-4 flex-1">
                {(expandedCategories[category] ? items : items.slice(0, 3)).map(
                  (item) => (
                  <li key={item._id} className="relative pl-6">
                    <span className="absolute left-0 top-2 w-2 h-2 rounded-full bg-[#857567]"></span>
                    <h4 className="text-md font-bold text-light-text mb-1 ">
                      {item.title}
                    </h4>
                    <p className="text-sm font-semibold text-[#857567] mb-2">
                      {item.date}
                    </p>
                    {/* {item.description && (
                      <p className="text-sm text-gray-700 leading-relaxed">
                        {item.description}
                      </p>
                    )} */}
                  </li>
                ))}
              </ul>

              {items.length > 3 && (
                <button
                  type="button"
                  onClick={() => toggleCategory(category)}
                  className="mt-6 text-sm font-semibold text-[#5a5047] self-start"
                >
                  {expandedCategories[category] ? "Read less" : "Read more"}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OutsideInteraction;
