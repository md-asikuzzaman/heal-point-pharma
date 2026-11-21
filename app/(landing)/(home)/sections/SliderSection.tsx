"use client";

import Container from "@/components/shared/Container";
import HeroSlider from "../components/HeroSlider";

const SliderSection = () => {
  return (
    <section className="mt-3 md:mt-6">
      <Container className="px-1 md:p-0!">
        <HeroSlider />
      </Container>
    </section>
  );
};

export default SliderSection;
