import { baseUrl } from "@/config";
import { useQuery } from "@tanstack/react-query";

export const useFetchBooks = () => {
  return useQuery({
    queryKey: ["books"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/books`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      return result.data;
    },
  });
};

export default useFetchBooks;
