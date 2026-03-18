import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Send,
  Github,
  Linkedin,
  Twitter,
  PhoneCall,
  Instagram,
  Facebook,
  Globe,
} from "lucide-react";
import { toast } from "react-toastify";
import api from "../../services/api";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [contactInfo, setContactInfo] = useState(null);

  useEffect(() => {
    fetchContactInfo();
  }, []);

  const fetchContactInfo = async () => {
    try {
      const { data } = await api.get("/contact-info");
      setContactInfo(data);
    } catch (error) {
      console.error("Failed to load contact info:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.post("/contact", formData);
      toast.success("Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      toast.error("Failed to send message. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <React.Fragment>
      <section
        id="contact"
        className="min-h-screen py-10 bg-dark-base px-5 md:px-10 lg:px-20  relative"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#a99888] rounded-full mix-blend-multiply filter blur-3xl opacity-10 blur-xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#857567] rounded-full mix-blend-multiply filter blur-3xl opacity-10 blur-xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-5"
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-wider text-light-text mb-2">
              GET IN TOUCH
            </h2>
            <div className="h-1 w-24 bg-[#857567] mx-auto rounded-full mb-6"></div>
            {/* <p className="text-[#f3eee6] text-lg max-w-2xl mx-auto">
              Have a project in mind, a research collaboration, or just want to
              say hi? Feel free to drop a message.
            </p> */}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="bg-[#ded6cc] p-10 rounded-2xl shadow-xl flex flex-col justify-between"
            >
              <div>
                <h3 className="text-3xl font-bold text-light-text mb-8">
                  Contact Information
                </h3>

                <div className="space-y-6">
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-[#857567] text-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                      <Mail size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-light-text">
                        Email
                      </h4>
                      <a
                        href={
                          contactInfo?.email
                            ? `mailto:${contactInfo.email}`
                            : "mailto:anjana.arakerimath@pccoepune.org"
                        }
                        className="text-[#857567] hover:underline font-medium break-all"
                      >
                        {contactInfo?.email ||
                          "anjana.arakerimath@pccoepune.org"}
                      </a>
                      <p className="text-sm text-gray-500 mt-1">
                        {contactInfo?.emailSubtext ||
                          "I usually reply within 24 hours."}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-[#857567] text-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                      <MapPin size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#5a5047]">
                        Location
                      </h4>
                      <p className="text-[#857567] font-medium">
                        {contactInfo?.location || "Bangalore, India"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {contactInfo?.locationSubtext ||
                          "Available for remote collaborations worldwide."}
                      </p>
                      {/* Office Details */}
                      {contactInfo?.officeName && (
                        <p className="text-[#857567] font-medium mt-2">
                          {contactInfo.officeName}
                        </p>
                      )}
                      {contactInfo?.officeMapLink && (
                        <a
                          href={contactInfo.officeMapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#857567] underline mt-1 block"
                        >
                          View on Google Maps
                        </a>
                      )}
                    </div>
                  </div>
                  <div className="flex items-start gap-5">
                    <div className="w-12 h-12 bg-[#857567] text-white rounded-full flex items-center justify-center shrink-0 shadow-md">
                      <PhoneCall size={24} />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold text-[#5a5047]">
                        Phone
                      </h4>
                      <p className="text-[#857567] font-medium">
                        {contactInfo?.phone || "+91 9876543210"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        {contactInfo?.phoneSubtext || "For urgent queries only"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-12">
                <h4 className="text-lg font-bold text-[#5a5047] mb-4">
                  Connect on Social
                </h4>
                <div className="flex gap-4">
                  {(contactInfo?.socialLinks?.github || !contactInfo) && (
                    <a
                      href={contactInfo?.socialLinks?.github || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[#5a5047] text-white rounded-full flex items-center justify-center hover:bg-[#857567] hover:-translate-y-1 transition-all"
                    >
                      <Github size={20} />
                    </a>
                  )}
                   {(contactInfo?.socialLinks?.instagram || !contactInfo) && (
                    <a
                      href={contactInfo?.socialLinks?.instagram || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[#5a5047] text-white rounded-full flex items-center justify-center hover:bg-[#857567] hover:-translate-y-1 transition-all"
                    >
                      <Instagram size={20} />
                    </a>
                  )}
                  {(contactInfo?.socialLinks?.linkedin || !contactInfo) && (
                    <a
                      href={contactInfo?.socialLinks?.linkedin || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[#5a5047] text-white rounded-full flex items-center justify-center hover:bg-[#857567] hover:-translate-y-1 transition-all"
                    >
                      <Linkedin size={20} />
                    </a>
                  )}
                  {(contactInfo?.socialLinks?.twitter || !contactInfo) && (
                    <a
                      href={contactInfo?.socialLinks?.twitter || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[#5a5047] text-white rounded-full flex items-center justify-center hover:bg-[#857567] hover:-translate-y-1 transition-all"
                    >
                      <Twitter size={20} />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-dark-base p-10 rounded-2xl shadow-[0_0_30px_rgba(133,117,103,0.15)] border border-[#857567]/30"
            >
              <h3 className="text-3xl font-bold text-light-text mb-8">
                Send a Message
              </h3>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="group">
                    <label className="block text-sm font-semibold mb-2 text-[#a99888] group-focus-within:text-light-text transition-colors">
                      Your Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-transparent border-b-2 border-[#857567] py-2 text-light-text placeholder-gray-500 focus:outline-none focus:border-[#857567] transition-colors"
                      placeholder="your Name"
                    />
                  </div>
                  <div className="group">
                    <label className="block text-sm font-semibold mb-2 text-[#a99888] group-focus-within:text-[#f3eee6] transition-colors">
                      Your Email
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-transparent border-b-2 border-[#857567] py-2 text-light-text placeholder-gray-500 focus:outline-none focus:border-[#857567] transition-colors"
                      placeholder="your@gmail.com"
                    />
                  </div>
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold mb-2 text-[#a99888] group-focus-within:text-[#f3eee6] transition-colors">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    className="w-full bg-transparent border-b-2 border-[#857567] py-2 text-light-text placeholder-gray-500 focus:outline-none focus:border-[#857567] transition-colors"
                    placeholder="Your Subject for contact"
                  />
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold mb-2 text-[#a99888] group-focus-within:text-[#f3eee6] transition-colors">
                    Message
                  </label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-transparent border-b-2 border-[#857567] py-2 text-light-text placeholder-gray-500 focus:outline-none focus:border-[#857567] transition-colors h-32 resize-none"
                    placeholder="Tell me about your project..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-8 py-4 bg-[#857567] text-white rounded-full font-bold tracking-wide hover:bg-[#a99888] hover:shadow-[0_0_20px_rgba(133,117,103,0.4)] transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-3 disabled:opacity-70 disabled:hover:transform-none"
                >
                  {isSubmitting ? "SENDING..." : "SEND MESSAGE"}
                  <Send
                    size={20}
                    className={isSubmitting ? "animate-pulse" : ""}
                  />
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="bg-[#1a1714] py-8 text-center border-t border-[#857567]/40">
        <div className="max-w-7xl mx-auto px-5">
          <p className="text-[#a99888] tracking-widest text-sm uppercase">
            &copy; {new Date().getFullYear()} ANJANA R ARAKERIMATH. All Rights
            Reserved.
          </p>
          <Link
            to="/admin/login"
            className="inline-block mt-4 text-[#857567] hover:text-[#a99888] text-xs font-bold tracking-widest uppercase transition-colors"
          >
            Admin Login
          </Link>
        </div>
      </footer>
    </React.Fragment>
  );
};

export default Contact;
