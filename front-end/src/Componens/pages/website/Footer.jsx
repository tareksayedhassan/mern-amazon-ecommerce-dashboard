import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { faPhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { useNavigate } from "react-router-dom";
import AppStore from "../../../assets/app-store-6647240_1280.png";
import GooglePlay from "../../../assets/en_badge_web_generic.png";
import { Badge } from "primereact/badge";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer
      className="w-full pt-6 pb-2 px-6 text-white"
      style={{ backgroundColor: "var(--primary-color)" }}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-14 text-center md:text-left">
        <div>
          <Badge
            value="MegaMart"
            className="text-3xl font-bold bg-transparent border-none cursor-pointer mb-2"
            style={{ color: "white" }}
            onClick={() => navigate("/")}
          />
          <ul className="space-y-2 text-sm mt-2">
            <li className="mt-4 mb-2 text-lg font-semibold border-b border-white inline-block pb-1">
              Contact Us
            </li>
            <li className="m-2">
              <FontAwesomeIcon icon={faWhatsapp} className="mr-2" />
              WhatsApp: <span className="inline p-1">01003383601</span>
            </li>
            <li className="m-2">
              <FontAwesomeIcon icon={faPhone} className="mr-2" />
              Call Us: <span className="inline p-1">01003383601</span>
            </li>
          </ul>

          <h3 className="mt-6 mb-2 text-lg font-semibold border-b border-white inline-block pb-1">
            Download App
          </h3>
          <div className="flex flex-col items-center md:items-start gap-2 mt-2">
            <img src={AppStore} alt="App Store" width="130" />
            <img src={GooglePlay} alt="Google Play" width="140" />
          </div>
        </div>

        <div className="flex justify-content-around gap-7 ">
          <div>
            <h3 className="mb-2 text-lg font-semibold border-b border-white inline-block pb-1">
              Most Popular Categories
            </h3>
            <ul className="space-y-3 mt-2 text-sm">
              <li className="m-2">Electronics</li>
              <li className="m-2">Fashion</li>
              <li className="m-2">Home Appliances</li>
              <li className="m-2">Beauty Products</li>
              <li className="m-2">Groceries</li>
            </ul>
          </div>

          <div>
            <h3 className="mb-2 text-lg font-semibold border-b border-white inline-block pb-1">
              Useful Links
            </h3>
            <ul className="space-y-3 mt-2 text-sm ">
              <li className="m-2">About Us</li>
              <li className="m-2">Privacy Policy</li>
              <li className="m-2">Terms & Conditions</li>
              <li className="m-2">FAQs</li>
              <li className="m-2"> Help Center</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Bottom Line */}
      <div className="text-center mt-6 text-xs border-t border-white pt-3">
        <p>© {new Date().getFullYear()} All rights reserved.</p>
        <p>
          Made by{" "}
          <strong>
            <a
              href="https://github.com/tareksayedhassan"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:text-gray-300 underline"
            >
              Tarek ElSayed
            </a>
          </strong>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
