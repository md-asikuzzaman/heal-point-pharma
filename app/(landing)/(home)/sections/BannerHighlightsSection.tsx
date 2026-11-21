"use client";

import { MdLocalPharmacy, MdOutlineSupportAgent } from "react-icons/md";
import {} from "react-icons";
import { FaLeaf } from "react-icons/fa";
import { BiPhoneCall } from "react-icons/bi";
import Container from "@/components/shared/Container";

const BannerHighlights = () => {
  const items = [
    {
      icon: MdLocalPharmacy,
      title: "NATURAL MEDICINE",
      subtitle: "Authentic & Trusted",
    },
    {
      icon: FaLeaf,
      title: "100% ORGANIC",
      subtitle: "Certified Ingredients",
    },
    {
      icon: MdOutlineSupportAgent,
      title: "24/7 SUPPORT",
      subtitle: "Always Available",
    },
    {
      icon: BiPhoneCall,
      title: "+8801XXXXXXXXX",
      subtitle: "Have a Question?",
    },
  ];

  return (
    <section className="my-6 md:my-8 lg:my-10 max-sm:mx-2">
      <Container className="bg-white py-10 px-6 sm:px-10 rounded-2xl shadow-md hover:shadow-lg transition-shadow border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map(({ icon: Icon, title, subtitle }, index) => (
            <div
              key={index}
              className="bg-green-50 rounded-xl shadow-md p-5 text-center hover:shadow-lg transition-all border border-green-100 hover:border-green-300"
            >
              <div className="flex justify-center mb-3">
                <Icon className="size-8 text-green-600" aria-label={title} />
              </div>
              <h4 className="text-base font-bold text-green-700">{title}</h4>
              <p className="text-sm text-gray-500" aria-label={subtitle}>
                {subtitle}
              </p>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default BannerHighlights;
