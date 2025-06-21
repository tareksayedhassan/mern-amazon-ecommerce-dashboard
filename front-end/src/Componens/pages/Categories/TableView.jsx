import React, { useEffect, useState } from "react";
import { Axios } from "../../../Api/Axios";
import { GET_GATEGORY } from "../../../Api/APi";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import { toast } from "react-toastify";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";

const TableView = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios.get(`/${GET_GATEGORY}`).then((res) =>
          console.log(res.data.data)
        );
        const allCategories = res.data.data;
        setCategories(allCategories);
      } catch (error) {
        toast.error("تعذر تحميل الأقسام");
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="p-4">
      <div className="grid grid-nogutter justify-content-center">
        {categories.map((cat, index) => (
          <div
            key={cat._id || index}
            className="col-12 sm:col-6 md:col-4 lg:col-3 p-2"
          >
            <Tooltip
              target={`.cat-${index}`}
              content={cat.name}
              position="top"
              showDelay={300}
            />
            <Card
              className="shadow-3 hover:shadow-5 transition-all"
              onClick={() => navigate(`/category/${cat._id}`)}
              style={{ cursor: "pointer", textAlign: "center" }}
            >
              <Avatar
                image={cat.image || "https://via.placeholder.com/160"}
                shape="circle"
                className={`cat-${index} mb-3`}
                style={{
                  width: "120px",
                  height: "120px",
                  border: "2px solid #ccc",
                  margin: "0 auto",
                }}
              />
              <h3 className="text-lg font-bold text-gray-800">{cat.name}</h3>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableView;
