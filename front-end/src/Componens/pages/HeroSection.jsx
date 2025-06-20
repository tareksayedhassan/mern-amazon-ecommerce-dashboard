import React from "react";
import { Carousel } from "primereact/carousel";
import img1 from "../../assets/img1.jpg";
import img2 from "../../assets/img2.jpg";
import img3 from "../../assets/img3.jpg";
const HeroSection = () => {
  const images = [
    {
      src: img1,
      alt: "Image 1",
    },
    {
      src: img2,
      alt: "Image 2",
    },
    {
      src: img3,
      alt: "Image 3",
    },
  ];

  const itemTemplate = (image) => {
    return (
      <div className="relative w-full">
        <img
          src={image.src}
          alt={image.alt}
          className="w-full"
          style={{ maxHeight: "400px", objectFit: "cover" }}
        />

        <div
          className="absolute top-0 left-0 w-full h-full"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.4)" }}
        ></div>

        <div
          className="absolute text-center text-white p-4"
          style={{
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.7)",
            zIndex: 2,
          }}
        ></div>
      </div>
    );
  };

  return (
    <div className="flex flex-column align-items-center justify-content-center text-center p-5 surface-100">
      <Carousel
        value={images}
        itemTemplate={itemTemplate}
        numVisible={1}
        numScroll={1}
        autoplayInterval={4000}
        circular={true}
        showIndicators={true}
        showNavigators={true}
        className="w-full mb-3"
      />
    </div>
  );
};

export default HeroSection;
