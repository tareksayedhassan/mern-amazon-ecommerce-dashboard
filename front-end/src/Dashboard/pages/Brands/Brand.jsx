import React, { useState, useEffect } from "react";
import { classNames } from "primereact/utils";
import { FilterMatchMode } from "primereact/api";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dropdown } from "primereact/dropdown";
import { MultiSelect } from "primereact/multiselect";
import { Tag } from "primereact/tag";
import { TriStateCheckbox } from "primereact/tristatecheckbox";
import { Axios } from "../../../Api/Axios";
import { GET_BRANDS } from "../../../Api/APi";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { Button } from "primereact/button";

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    name: { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    "country.name": { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    representative: { value: null, matchMode: FilterMatchMode.IN },
    status: { value: null, matchMode: FilterMatchMode.EQUALS },
    verified: { value: null, matchMode: FilterMatchMode.EQUALS },
  });
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [statuses] = useState([
    "unqualified",
    "qualified",
    "new",
    "negotiation",
    "renewal",
  ]);

  useEffect(() => {
    const getAllBrands = async () => {
      try {
        setLoading(true);
        const res = await Axios.get(`/${GET_BRANDS}`);
        setBrands(res.data.data);
      } catch (error) {
        toast.error("Cannot get Brands");
      } finally {
        setLoading(false);
      }
    };
    getAllBrands();
  }, []);

  const getSeverity = (status) => {
    switch (status) {
      case "unqualified":
        return "danger";
      case "qualified":
        return "success";
      case "new":
        return "info";
      case "negotiation":
        return "warning";
      case "renewal":
        return null;
      default:
        return null;
    }
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    setGlobalFilterValue(value);
    setFilters((prev) => ({
      ...prev,
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    }));
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between align-items-center flex-wrap gap-2">
        <IconField iconPosition="left" className="w-full sm:w-auto">
          <InputIcon className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Search..."
            className="w-full sm:w-18rem"
          />
        </IconField>
        <Link to="/dashboard/add/brand">
          <Button label="Add Brand" icon="pi pi-plus" className="p-button-sm" />
        </Link>
      </div>
    );
  };

  const imageBodyTemplate = (rowData) => {
    let imageUrl = rowData.image;

    if (imageUrl?.includes("uploads/uploads")) {
      imageUrl = imageUrl.replace("uploads/uploads", "uploads");
    }

    return imageUrl ? (
      <img
        src={imageUrl}
        alt={rowData.name || "Category Image"}
        style={{ width: "50px", height: "50px", objectFit: "cover" }}
        onError={(e) => {
          e.target.src = "http://localhost:4000/uploads/category.webp";
        }}
      />
    ) : (
      <span>No Image Found</span>
    );
  };
  const statusBodyTemplate = (rowData) => (
    <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
  );

  const statusItemTemplate = (option) => (
    <Tag value={option} severity={getSeverity(option)} />
  );

  const verifiedBodyTemplate = (rowData) => (
    <i
      className={classNames("pi", {
        "pi-check-circle text-green-500": rowData.verified,
        "pi-times-circle text-red-500": !rowData.verified,
      })}
    ></i>
  );

  const representativeRowFilterTemplate = (options) => {
    const representatives = brands
      .filter((b) => b.representative)
      .map((b) => b.representative);

    return (
      <MultiSelect
        value={options.value}
        options={representatives}
        itemTemplate={(option) => (
          <div className="flex align-items-center gap-2">
            <img
              alt={option.name}
              src={`https://primefaces.org/cdn/primereact/images/avatar/${
                option.image || "placeholder.png"
              }`}
              width="32"
            />
            <span>{option.name}</span>
          </div>
        )}
        onChange={(e) => options.filterApplyCallback(e.value)}
        optionLabel="name"
        placeholder="Any"
        className="p-column-filter"
        maxSelectedLabels={1}
        style={{ minWidth: "14rem" }}
      />
    );
  };

  const statusRowFilterTemplate = (options) => (
    <Dropdown
      value={options.value}
      options={statuses}
      onChange={(e) => options.filterApplyCallback(e.value)}
      itemTemplate={statusItemTemplate}
      placeholder="Select One"
      className="p-column-filter"
      showClear
      style={{ minWidth: "12rem" }}
    />
  );

  const verifiedRowFilterTemplate = (options) => (
    <TriStateCheckbox
      value={options.value}
      onChange={(e) => options.filterApplyCallback(e.value)}
    />
  );

  return (
    <div className="card">
      <DataTable
        value={brands}
        paginator
        rows={10}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        loading={loading}
        globalFilterFields={[
          "name",
          "country.name",
          "representative.name",
          "status",
        ]}
        header={renderHeader()}
        emptyMessage="No brands found."
      >
        <Column
          field="name"
          header="Name"
          filter
          filterPlaceholder="Search by name"
          style={{ minWidth: "12rem" }}
        />
        <Column
          field="country"
          header="Country"
          filterField="country.name"
          style={{ minWidth: "12rem" }}
          body={(rowData) => rowData.country || "N/A"}
          filter
          filterPlaceholder="Search by country"
        />
        <Column
          field="representative"
          header="Agent"
          filterField="representative"
          showFilterMenu={false}
          style={{ minWidth: "14rem" }}
          body={(rowData) =>
            rowData.representative ? rowData.representative.name : "N/A"
          }
          filter
          filterElement={representativeRowFilterTemplate}
        />
        <Column header="logo" body={imageBodyTemplate} />
        <Column
          field="status"
          header="Status"
          showFilterMenu={false}
          style={{ minWidth: "12rem" }}
          body={statusBodyTemplate}
          filter
          filterElement={statusRowFilterTemplate}
        />
        <Column
          field="verified"
          header="Verified"
          dataType="boolean"
          style={{ minWidth: "6rem" }}
          body={verifiedBodyTemplate}
          filter
          filterElement={verifiedRowFilterTemplate}
        />
      </DataTable>
    </div>
  );
};

export default Brand;
