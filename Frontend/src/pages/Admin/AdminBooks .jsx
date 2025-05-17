import useFetchBooks from "@/hooks/useFetchBooks";
import { columns } from "@/table/books/Columns";
import { DataTable } from "@/table/books/DataTable";
import React from "react";

const AdminBooks = () => {
  const { data = [] } = useFetchBooks();

  return (
    <DataTable columns={columns} data={data}/>
  );
};

export default AdminBooks;
