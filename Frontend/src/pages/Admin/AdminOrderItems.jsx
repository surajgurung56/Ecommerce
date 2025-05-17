import { baseUrl } from "@/config";
import { columns } from "@/table/oderitems/Columns";
import { DataTable } from "@/table/oderitems/DataTable";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AdminOrderItems = () => {
  const { orderId } = useParams();
  const [orderItems, setOrderItems] = useState([]);

  const getOrderDetails = async () => {
    try {
      const response = await fetch(`${baseUrl}/order/order-items/${orderId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setOrderItems(result.data.orderItems);
        setOrder(result.data);
      } else {
        setError("Failed to load order details");
      }
    } catch (error) {
      console.error("Error fetching order details:", error);
      setError("An error occurred while fetching order details");
    }
  };

  useEffect(() => {
    if (orderId) getOrderDetails();
  }, [orderId]);

  return <DataTable columns={columns} data={orderItems} />;
};

export default AdminOrderItems;
