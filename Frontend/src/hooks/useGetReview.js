import { baseUrl } from "@/config";
import { useQuery } from "@tanstack/react-query";

export const useGetReview = () => {
  return useQuery({
    queryKey: ["review"],
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

export default useGetReview;
