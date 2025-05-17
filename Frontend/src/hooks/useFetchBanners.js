import { baseUrl } from "@/config";
import { useQuery } from "@tanstack/react-query";

export const useFetchBanners = () => {
  return useQuery({
    queryKey: ["banners"],
    queryFn: async () => {
      const response = await fetch(`${baseUrl}/banners`, {
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

export default useFetchBanners;
