import React from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import BestSeal from "./bestseal";
import Categories from "./Categoryies";
import Brands from "./Brands";
const Home = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <BestSeal />
      <Categories />
      <Brands />
    </div>
  );
};

export default Home;
