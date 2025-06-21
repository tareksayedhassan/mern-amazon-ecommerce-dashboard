import React from "react";
import { BreadCrumb as PrimeBreadCrumb } from "primereact/breadcrumb";
import { useLocation } from "react-router-dom";

const CustomBreadCrumb = () => {
  const location = useLocation();

  const pathName = location.pathname.split("/").filter((x) => x);

  const home = { icon: "pi pi-home", url: "/" };

  const items = pathName.map((name, index) => {
    const url = "/" + pathName.slice(0, index + 1).join("/");

    return {
      label: decodeURIComponent(name),
      url,
    };
  });

  return <PrimeBreadCrumb model={items} home={home} />;
};

export default CustomBreadCrumb;
