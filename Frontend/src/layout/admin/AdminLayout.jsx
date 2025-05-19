import React, { useContext, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import { UserContext } from "@/context/UserContext";

const AdminLayout = () => {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;

    if (!user || !user.roles.includes("admin")) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className={`w-full transition-all duration-300 ml-64 $`}>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
