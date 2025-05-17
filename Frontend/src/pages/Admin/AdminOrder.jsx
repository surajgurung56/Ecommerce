import useFetchAdminOrders from "@/hooks/useFetchAdminOrders";
import { columns } from "@/table/orders/Columns";
import { DataTable } from "@/table/orders/DataTable";
import React from "react";

const AdminOrder = () => {
  const { data = [] } = useFetchAdminOrders();

  return (
    <DataTable columns={columns} data={data}/>
  );
};

export default AdminOrder;