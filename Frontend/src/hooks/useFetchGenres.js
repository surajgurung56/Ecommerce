import { baseUrl } from "@/config";
import { useQuery } from "@tanstack/react-query";

export const useFetchGenres = () => {
  return useQuery({
    queryKey: ["genres"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/categories`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      return result;
    },
  });
};

export default useFetchGenres;
