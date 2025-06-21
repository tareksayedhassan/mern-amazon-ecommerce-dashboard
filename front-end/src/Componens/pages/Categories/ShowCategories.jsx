import React from "react";
import Header from "../website/Header";
import Footer from "../website/Footer";
import SidebarFilters from "./SideBar";
import CustomBreadCrumb from "../../../util/BreadCrumb";
import TableView from "./TableView";

const ShowCategories = () => {
  return (
    <>
      <Header />
      <div className="p-4">
        <CustomBreadCrumb />
      </div>

      <div className="flex flex-col md:flex-row gap-3 mt-4 min-h-[calc(100vh-140px)]">
        {/* Sidebar */}
        <div className="w-full md:w-[280px] flex-shrink-0 overflow-y-auto max-h-[calc(100vh-140px)]">
          <SidebarFilters />
        </div>

        {/* TableView */}
        <div className="flex-1 overflow-auto">
          <TableView />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShowCategories;
