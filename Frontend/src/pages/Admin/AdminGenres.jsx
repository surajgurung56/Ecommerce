import useFetchGenres from "@/hooks/useFetchGenres";
import { columns } from "@/table/genres/Columns";
import { DataTable } from "@/table/genres/DataTable";
import React from "react";

const AdminGenres = () => {
  const { data = [] } = useFetchGenres();

  return <DataTable columns={columns} data={data} />;
};

export default AdminGenres;
