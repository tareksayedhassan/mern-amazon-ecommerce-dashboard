import React, { useEffect, useState } from "react";
import Header from "../../website/Header";
import Footer from "../../website/Footer";
import CustomBreadCrumb from "../../../../util/BreadCrumb";
import { useParams } from "react-router-dom";
import { GET_SINGLE_PRODUCT } from "../../../../Api/APi";
import { Axios } from "../../../../Api/Axios";

const ProductDetails = () => {
  const [product, setProduct] = useState([]);
  const { categoryId, productId } = useParams();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await Axios.get(`${GET_SINGLE_PRODUCT}/${productId}`);
        setProduct(res.data.data);
      } catch (err) {
        toast.error("Product not found");
      }
    };

    fetchProduct();
  }, [productId]);

  return (
    <div>
      <Header />
      <CustomBreadCrumb />
      <Footer />
    </div>
  );
};

export default ProductDetails;
