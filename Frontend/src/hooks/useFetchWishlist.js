import { baseUrl } from "@/config";
import { useQuery } from "@tanstack/react-query";

export const useFetchWishlist = () => {
  return useQuery({
    queryKey: ["wishlists"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/wishlists`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const result = await response.json();

      return result;
    },
  });
};

export default useFetchWishlist;





