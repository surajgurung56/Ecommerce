import { baseUrl } from "@/config";
import { useQuery } from "@tanstack/react-query";

export const useFetchCart = () => {
  return useQuery({
    queryKey: ["carts"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/carts`, {
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

export default useFetchCart;
