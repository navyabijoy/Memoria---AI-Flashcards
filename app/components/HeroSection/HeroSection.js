import React from 'react';
import MeshLines from './meshlines';
import Content from './content';

const HeroSection = () => {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <MeshLines />
      <Content />
    </section>
  );
};

export default HeroSection;