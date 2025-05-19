import BookCard from "@/components/BookCard";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { baseUrl } from "@/config";
import Autoplay from "embla-carousel-autoplay";

import useFetchBanners from "@/hooks/useFetchBanners";

import useFetchBooks from "@/hooks/useFetchBooks";
import { useNavigate } from "react-router-dom";
import { usefetchBestSeller } from "@/hooks/usefetchBestSeller";

const Home = () => {
  const { data: banners = [] } = useFetchBanners();
  const { data: books = [] } = useFetchBooks();
  const { data: bestSellers = [] } = usefetchBestSeller();

  const navigate = useNavigate();

  return (
    <div>
      {banners.length > 0 && (
        <div className="bg-gray-50 py-10 sm:px-6">
          {banners.length > 0 && (
            <div className="bg-gray-50 py-10 sm:px-6">
              <Carousel
                plugins={[
                  Autoplay({
                    delay: 5000,
                  }),
                ]}
              >
                <CarouselContent>
                  {banners.map((banner, index) => (
                    <CarouselItem key={index}>
                      <div className="flex flex-col-reverse md:flex-row items-center justify-between max-w-7xl mx-auto gap-12">
                        <div className="w-full md:w-1/2 space-y-6">
                          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
                            {banner.heading || ""}
                          </h1>
                          <p className="text-lg md:text-xl text-gray-700">
                            {banner.message || ""}
                          </p>

                          <Button
                            onClick={() => navigate(banner?.link)}
                            variant="outline"
                            className="uppercase text-sm font-medium border border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition duration-300"
                          >
                            Explore
                          </Button>
                        </div>
                        <div className="w-full md:w-1/2 flex justify-center">
                          <div className="rounded-xl overflow-hidden">
                            <img
                              src={`${baseUrl}${banner.imageUrl}`}
                              alt="Featured Book"
                              className="aspect-[4/3] object-cover w-full h-auto"
                            />
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
              </Carousel>
            </div>
          )}
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-12 bg-white">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Best Sellers</h2>
            <p className="text-gray-600 text-sm mt-1">
              Find Your Next Great Read Among Our Best Sellers.
            </p>
          </div>
          <a
            href="#"
            className="text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
          >
            Show All
          </a>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {bestSellers.slice(0, 4).map((item) => (
            <BookCard key={item.book.id} book={item.book} />
          ))}
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 py-12 px-4 md:px-8 max-w-7xl mx-auto bg-gray-50 rounded-xl shadow-sm">
        <div className="md:w-1/2">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Get 5% Off When You Purchase 5 Books!
          </h2>
          <p className="text-gray-700 mb-6">
            Enjoy extra savings while building your personal library.
          </p>
          <Button
            variant="outline"
            className="uppercase text-sm font-medium border border-gray-300 hover:bg-gray-100 hover:text-gray-900 transition duration-300"
          >
            Explore Books
          </Button>
        </div>

        <div className="md:w-1/2 flex justify-center">
          <img
            src="/books.png"
            alt="Helping Your Child to Read"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
