import {
  contactInfo,
  footerSections,
  socialLinks,
} from "@/constants/footerData";
import Link from "next/link";
import { FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import Container from "../shared/Container";

import { BsWhatsapp } from "react-icons/bs";

const Footer = () => {
  return (
    <footer className="from-green-950 to-green-800 bg-linear-to-t text-gray-200">
      <Container>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 py-10">
          {/* Dynamic Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-3 text-white">
                {section.title}
              </h3>
              <ul className="space-y-2 text-sm">
                {section.links.map((link) => (
                  <li key={link.label}>
                    {link.href.startsWith("/") ? (
                      <Link
                        href={link.href}
                        className="hover:text-white transition"
                      >
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        className="hover:text-white transition"
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">
              Information
            </h3>
            <ul className="space-y-3 text-sm text-gray-300">
              <li className="flex items-start gap-2">
                <FaMapMarkerAlt className="mt-1 text-green-400" />
                <span>{contactInfo.address}</span>
              </li>

              <li className="flex items-center gap-2">
                <FaPhoneAlt className="text-green-400" />
                <a
                  href={`tel:${contactInfo.phone}`}
                  className="hover:text-white"
                >
                  {contactInfo.phone}
                </a>
              </li>

              <li className="flex items-center gap-2">
                <BsWhatsapp className="text-green-400" />

                <a
                  href={`https://wa.me/${contactInfo.whatsapp}`}
                  className="hover:text-white"
                >
                  {contactInfo.whatsapp}
                </a>
              </li>

              <li className="flex items-center gap-2">
                <FaEnvelope className="text-green-400" />
                <a
                  href={`mailto:${contactInfo.email}`}
                  className="hover:text-white"
                >
                  {contactInfo.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-white">Follow Us</h3>
            <div className="flex items-center gap-4 mt-2">
              {socialLinks.map(({ icon: Icon, href, label }, index) => (
                <Link
                  aria-label={label}
                  key={index}
                  href={href}
                  className="text-gray-300 hover:text-white transition transform hover:scale-110"
                >
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>

      {/* Copyright */}
      <div className="text-center py-4 text-sm text-gray-300 border-t border-green-900">
        &copy; {new Date().getFullYear()} Heal point. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
