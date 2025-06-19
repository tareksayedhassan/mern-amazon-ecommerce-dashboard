import React, { useEffect, useState } from "react";
import { Axios } from "../../Api/Axios";
import { GET_GATEGORY } from "../../Api/APi";
import { Avatar } from "primereact/avatar";
import { toast } from "react-toastify";
import { Tooltip } from "primereact/tooltip";
import { motion } from "framer-motion";

const CategoriesSection = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios.get(`/${GET_GATEGORY}`);
        setCategories(res.data.data);
      } catch (error) {
        toast.error("Can't load categories");
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="p-5 surface-100 text-center">
      <h2 className="text-3xl font-bold mb-5 text-primary">
        🛒 Shop by Category
      </h2>
      <div className="flex flex-wrap justify-content-center gap-5">
        {categories.map((cat, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              duration: 0.5,
              type: "spring",
              bounce: 0.4,
              delay: index * 0.1,
            }}
          >
            <Tooltip
              target={`.cat-${index}`}
              content={cat.name}
              position="top"
            />
            <Avatar
              image={cat.image}
              shape="circle"
              className={`cat-${index} shadow-4 hover:shadow-6 transition-shadow`}
              style={{
                width: "160px",
                height: "160px",
                border: "3px solid #e0e0e0",
              }}
            />
            <span className="mt-3 text-lg font-semibold text-gray-700 text-center">
              {cat.name}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CategoriesSection;
