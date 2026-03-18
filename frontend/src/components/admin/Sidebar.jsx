import React, { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  UserCircle,
  BookOpen,
  FileText,
  Share2,
  Palette,
  Image as ImageIcon,
  Mail,
  LogOut,
  Award,
  PhoneCall,
  Settings,
} from "lucide-react";
import { AuthContext } from "../../context/AuthContext";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const links = [
    { name: "Dashboard", path: "/admin", icon: <LayoutDashboard size={20} /> },
    {
      name: "Manage Profile",
      path: "/admin/profile",
      icon: <UserCircle size={20} />,
    },
    {
      name: "Manage Certifications", // Changed name from E-Learning
      path: "/admin/certificates", // Changed path from /admin/courses
      icon: <Award size={20} />, // Changed icon from BookOpen
    },
    { name: "Research", path: "/admin/research", icon: <FileText size={20} /> },
    {
      name: "Interactions",
      path: "/admin/interactions",
      icon: <Share2 size={20} />,
    },
    {
      name: "Manage Teaching",
      path: "/admin/teaching",
      icon: <BookOpen size={20} />,
    },
    {
      name: "Creativity",
      path: "/admin/creativity",
      icon: <Palette size={20} />,
    },
    { name: "Gallery", path: "/admin/gallery", icon: <ImageIcon size={20} /> },
    { name: "Messages", path: "/admin/messages", icon: <Mail size={20} /> },
    {
      name: "Contact Info",
      path: "/admin/contact-info",
      icon: <PhoneCall size={20} />,
    },
    {
      name: "Admin Credentials",
      path: "/admin/credentials",
      icon: <Settings size={20} />,
    },
  ];

  return (
    <div className="w-64 bg-dark-base border-r border-black h-screen flex flex-col fixed left-0 top-0">
      <div className="p-6 border-b border-black">
        <h1 className="text-xl font-bold tracking-wider text-black">
          PORTFOLIO
        </h1>
        <p className="text-sm mt-1 text-black">Admin Panel</p>
      </div>
      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-2 px-4">
          {links.map((link) => (
            <li key={link.name}>
              <NavLink
                to={link.path}
                end={link.path === "/admin"}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#857567] text-[#f3eee6] shadow-md transform scale-[1.02]"
                      : "text-[#5a5047] "
                  }`
                }
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="p-4 border-t  border-black">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-lg text-[#000000]  bg-red-500/80 hover:text-white  "
        >
          <LogOut
            size={20}
            className="group-hover:-translate-x-1 transition-transform"
          />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
