import { baseUrl } from "@/config";
import { useQuery } from "@tanstack/react-query";

export const usefetchBestSeller = (orderId) => {
  return useQuery({
    queryKey: ["orderItems"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/popular-books`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();

      return result.data;
    },
  });
};
