import useFetchBanners from "@/hooks/useFetchBanners";
import { columns } from "@/table/banners/Columns";
import { DataTable } from "@/table/banners/DataTable";
import React from "react";

const Banner = () => {
  const { data = [] } = useFetchBanners();

  console.log(data);

  return <DataTable columns={columns} data={data} />;
};

export default Banner;
