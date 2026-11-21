"use client";

import Container from "@/components/shared/Container";
import HeroSlider from "../components/HeroSlider";

const SliderSection = () => {
  return (
    <section className="my-3 md:my-6">
      <Container className="px-1 md:p-0!">
        <HeroSlider />
      </Container>
    </section>
  );
};

export default SliderSection;
