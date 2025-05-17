import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const AdminLayout = () => {

  const [sidebarToggle, setSidebarToggle]= useState(false);
  return (
    <div className="flex">
      <Sidebar
        sidebarToggle={sidebarToggle}
        setSidebarToggle={setSidebarToggle}
      />
      <div
        className={`w-full transition-all duration-300 ${
          sidebarToggle ? "" : "ml-64"
        }`}
      >
        {/* <Navbar
          sidebarToggle={sidebarToggle}
          setSidebarToggle={setSidebarToggle}
        /> */}
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
