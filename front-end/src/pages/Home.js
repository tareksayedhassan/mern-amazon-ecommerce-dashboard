import React, { useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import Header from "../Componens/webSite/Header";
import HeroSection from "../Componens/webSite/HeroSection";
import CategoriesSection from "../Componens/webSite/CategoriesSection";
import Products from "../Componens/webSite/Products";

const NewsletterSection = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="p-5 text-center">
      <h2 className="text-3xl font-bold mb-3">Subscribe to Our Newsletter</h2>
      <p className="text-gray-600 mb-4">
        Stay updated with the latest offers and products!
      </p>
      <div className="flex justify-content-center gap-2">
        <InputText
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full md:w-3"
        />
        <Button label="Subscribe" className="p-button-primary" />
      </div>
    </div>
  );
};

const FooterSection = () => (
  <div className="p-5 bg-gray-800 text-white">
    <div className="grid">
      <div className="col-12 md:col-4">
        <h3 className="text-xl font-bold mb-3">Quick Links</h3>
        <ul className="list-none p-0">
          <li>
            <a href="#" className="text-white no-underline">
              About Us
            </a>
          </li>
          <li>
            <a href="#" className="text-white no-underline">
              Contact
            </a>
          </li>
          <li>
            <a href="#" className="text-white no-underline">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="#" className="text-white no-underline">
              Terms of Service
            </a>
          </li>
        </ul>
      </div>
      <div className="col-12 md:col-4">
        <h3 className="text-xl font-bold mb-3">Customer Service</h3>
        <ul className="list-none p-0">
          <li>
            <a href="#" className="text-white no-underline">
              FAQ
            </a>
          </li>
        </ul>
      </div>
      <div className="col-12 md:col-4">
        <h3 className="text-xl font-bold mb-3">Follow Us</h3>
        <ul className="list-none p-0">
          <li>
            <a href="#" className="text-white no-underline">
              Facebook
            </a>
          </li>
          <li>
            <a href="#" className="text-white no-underline">
              Twitter
            </a>
          </li>
          <li>
            <a href="#" className="text-white no-underline">
              Instagram
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div className="text-center mt-4">
      <p>&copy; 2025 E-Commerce Store. All rights reserved.</p>
    </div>
  </div>
);

const Home = () => {
  return (
    <div>
      <Header />
      <HeroSection />
      <CategoriesSection />
      <Products />
      <NewsletterSection />
      <FooterSection />
    </div>
  );
};

export default Home;
