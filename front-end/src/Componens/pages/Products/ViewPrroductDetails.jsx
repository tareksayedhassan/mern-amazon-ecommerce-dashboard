import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GET_SINGLE_PRODUCT } from "../../../Api/APi";
import { Axios } from "../../../Api/Axios";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import { toast } from "react-toastify";
import { useCart } from "../../../context/CartContext";

const ViewPrroductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await Axios.get(`${GET_SINGLE_PRODUCT}/${id}`);
        setProduct(res.data.data);
        setMainImage(res.data.data.image[0]);
      } catch (err) {
        toast.error("Product not found");
      }
    };

    fetchProduct();
  }, [id]);
  const { addToCart } = useCart();

  const handleAdd = () => {
    addToCart(product);
  };

  if (!product) return <p>Loading...</p>;

  return (
    <div className="grid p-4">
      <div
        className="col-12 md:col-2 flex justify-content-center align-items-center"
        style={{ height: "400px" }}
      >
        <div
          className="flex flex-column gap-3"
          style={{
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {product.image.slice(0, 3).map((img, i) => (
            <div
              key={i}
              style={{
                width: "110px",
                height: "110px",
                overflow: "hidden",
                borderRadius: "8px",
                cursor: "pointer",
              }}
            >
              <Image
                src={img}
                alt={`thumb-${i}`}
                width="100%"
                height="100%"
                onClick={() => setMainImage(img)}
                imageStyle={{
                  objectFit: "cover",
                  width: "100%",
                  height: "100%",
                }}
                preview
              />
            </div>
          ))}
        </div>
      </div>

      <div className="col-12 md:col-6 flex align-items-center justify-content-center">
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            maxHeight: "400px",
          }}
        >
          <Image
            src={mainImage}
            alt="main"
            preview
            imageStyle={{
              maxHeight: "400px",
              maxWidth: "100%",
              width: "auto",
              height: "100%",
              objectFit: "contain",
              borderRadius: "8px",
              boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            }}
          />
        </div>
      </div>

      <div className="col-12 md:col-4">
        <h2 className="mb-2">{product.title}</h2>
        <Rating value={product.rating} readOnly cancel={false} />
        <h3 className="text-primary mt-3">${product.price}</h3>
        <p className="text-sm text-700 mb-3">{product.description}</p>

        <div className="mb-2">
          <strong>Status:</strong> {product.status}
        </div>

        <div className="mb-2">
          <strong>Discount:</strong> {product.discount}
        </div>

        <hr className="my-3" />

        <div>
          <h4>About</h4>
          <p style={{ whiteSpace: "pre-line" }}>{product.about}</p>
        </div>

        <hr className="my-3" />

        <Button
          label="Add to Cart"
          className=" w-full mb-3"
          onClick={() => handleAdd()}
        />

        <div className="flex align-items-center gap-2">
          <h4 className="m-0">Quantity:</h4>
          <Button icon="pi pi-minus" className="p-button-sm" />
          <span>1</span>
          <Button icon="pi pi-plus" className="p-button-sm" />
        </div>
      </div>
    </div>
  );
};

export default ViewPrroductDetails;
