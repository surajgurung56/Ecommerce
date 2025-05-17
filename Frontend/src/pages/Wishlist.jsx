import BookCard from "@/components/BookCard";
import useFetchWishlist from "@/hooks/useFetchWishlist";

const Wishlist = () => {
  const { data: books = [] } = useFetchWishlist();

  return (
    <div className="p-6 max-w-7xl mx-auto bg-white min-h-screen">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Saved Items</h1>
        <p className="text-sm text-gray-600 mt-1">
          Unsave by clicking on bookmark icon
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {books.length > 0 ? (
          books.map((item, index) => (
            <BookCard
              key={index}
              book={item.book}
              isWished={true}
            />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No books found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
