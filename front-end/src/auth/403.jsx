import React from "react";
import "./Code403.css";
const Code403 = () => {
  return (
    <div className="text-wrapper">
      <div className="title" data-content={404}>
        {" "}
        403 - ACCESS DENIED
      </div>
      <div className="subtitle">
        Oops , You don't have permission to access this page .
      </div>
    </div>
  );
};

export default Code403;
