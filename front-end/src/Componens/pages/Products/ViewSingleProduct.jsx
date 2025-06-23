import React, { useEffect, useState } from "react";
import Header from "../website/Header";
import Footer from "../website/Footer";
import CustomBreadCrumb from "../../../util/BreadCrumb";
import ViewPrroductDetails from "./ViewPrroductDetails";

const ViewSingleProduct = () => {
  return (
    <div>
      <Header />
      <CustomBreadCrumb />
      <ViewPrroductDetails />
      <Footer />
    </div>
  );
};

export default ViewSingleProduct;
