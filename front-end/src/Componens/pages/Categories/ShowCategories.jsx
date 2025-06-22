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

      <div className="grid mt-4" style={{ minHeight: "calc(100vh - 140px)" }}>
        {windowSize >= 768 && (
          <div
            className="col-fixed"
            style={{
              width: "300px",
            }}
          >
            <SidebarFilters />
          </div>
        )}

        <div className="col" style={{ overflowY: "auto" }}>
          <TableView />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ShowCategories;
