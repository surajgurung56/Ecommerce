import { baseUrl } from "@/config";
import { useQuery } from "@tanstack/react-query";

export const useFetchAdminOrders = () => {
  return useQuery({
    queryKey: ["adminOrders"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/admin/orders`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();

      return result;
    },
  });
};

export default useFetchAdminOrders;
