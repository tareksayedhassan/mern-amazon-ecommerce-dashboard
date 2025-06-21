import React from "react";
import Header from "./Header";
import HeroSection from "./HeroSection";
import BestSeal from "./bestseal";
import Categories from "./Categoryies";
import Brands from "./Brands";
import Clothes from "./Clothes";
import Footer from "./Footer";
const Home = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <BestSeal />
      <Categories />
      <Brands />
      <Clothes />
      <Footer />
    </div>
  );
};

export default Home;
