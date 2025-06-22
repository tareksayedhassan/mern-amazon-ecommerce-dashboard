import React, { useContext, useState } from "react";
import Header from "../website/Header";
import Footer from "../website/Footer";
import SidebarFilters from "./SideBar";
import CustomBreadCrumb from "../../../util/BreadCrumb";
import TableView from "./TableView";
import { WindowSize } from "../../../context/WindowContext";
import PhoneSideBar from "./PhoneSideBar";
import { Button } from "primereact/button";

const ShowCategories = () => {
  const { windowSize } = useContext(WindowSize);
  const [showPhoneSidebar, setShowPhoneSidebar] = useState(false); // حالة فتح السايد بار في الموبايل

  return (
    <>
      <Header />
      <div className="p-4">
        <CustomBreadCrumb />
      </div>

      {windowSize < 768 && (
        <>
          <div className="flex justify-end px-4">
            <Button
              icon="pi pi-filter"
              label="فلترة"
              onClick={() => setShowPhoneSidebar(true)}
              className="p-button-sm p-button-outlined"
            />
          </div>
          <PhoneSideBar
            visible={showPhoneSidebar}
            onHide={() => setShowPhoneSidebar(false)}
          />
        </>
      )}

      <div className="flex flex-col md:flex-row gap-3 mt-4 min-h-[calc(100vh-140px)]">
        {windowSize >= 768 && (
          <div className="w-full md:w-[280px] flex-shrink-0 overflow-y-auto max-h-[calc(100vh-140px)]">
            <SidebarFilters />
          </div>
        )}

        <div className="flex-1 overflow-auto">
          <TableView />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShowCategories;
