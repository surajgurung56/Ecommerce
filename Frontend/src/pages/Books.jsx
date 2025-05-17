import BookCard from "@/components/BookCard";
import CustomInput from "@/components/ui/CustomInput";
import { baseUrl } from "@/config";
import useFetchBooks from "@/hooks/useFetchBooks";
import useFetchGenres from "@/hooks/useFetchGenres";
import useFetchWishlist from "@/hooks/useFetchWishlist";
import { SlidersHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const Books = () => {
  const { data: books = [] } = useFetchBooks();
  const { data: genres = [] } = useFetchGenres();
  const { data: Wishlist = [] } = useFetchWishlist();
  const wishlistBookIds = new Set(Wishlist.map((item) => item.bookId));

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState([]);
  const [bookList, setBookList] = useState([]);

  const toggleCategory = (id) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const toggleFormat = (id) => {
    setSelectedFormat((prev) =>
      prev.includes(id) ? prev.filter((catId) => catId !== id) : [...prev, id]
    );
  };

  const [currentPage, setCurrentPage] = useState(1);
  const booksPerPage = 8;

  const totalPages = Math.ceil(bookList.length / booksPerPage);
  const startIndex = (currentPage - 1) * booksPerPage;
  const currentBooks = bookList.slice(startIndex, startIndex + booksPerPage);

  const handlePrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));

  const formats = [
    { name: "Paperback", value: "paperback" },
    { name: "Hardcover", value: "hardcover" },
    { name: "Exclusive Edition", value: "exclusive" },
    { name: "Signed Copy", value: "signed" },
    { name: "Limited Edition", value: "limited" },
    { name: "First Edition", value: "first" },
    { name: "Collector’s Edition", value: "collector’s" },
    { name: "Author’s Edition", value: "author’s" },
    { name: "Deluxe Edition", value: "deluxe" },
  ];

  useEffect(() => {
    setBookList(Array.isArray(books) ? books : []);
  }, [books]);

  const clear = () => {
    setBookList(Array.isArray(books) ? books : []);
    setSelectedCategories([]);
    setSelectedFormat([]);
  };

  const applyFilter = async () => {
    try {
      const response = await fetch(`${baseUrl}/books/filter`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          categories: selectedCategories,
          formats: selectedFormat,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBookList(Array.isArray(data.data) ? data.data : []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    }
  };

  const applySort = async (value) => {
    try {
      const response = await fetch(`${baseUrl}/books/sort-by`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sortBy: value,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBookList(Array.isArray(data.data) ? data.data : []);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    }
  };

  const location = useLocation();
  const searchedBooks = location.state?.searchedBooks;

  useEffect(() => {
    if (Array.isArray(books)) {
      setBookList(books);
    }
  }, [books]);

  useEffect(() => {
    if (Array.isArray(searchedBooks)) {
      setBookList(searchedBooks);
    }
  }, [searchedBooks]);

  return (
    <div className="flex flex-col lg:flex-row max-w-7xl mx-auto gap-8 px-4 py-8">
      {/* Sidebar */}
      <aside className="w-full lg:w-64 shrink-0">
        <div className="sticky top-24 p-4 border rounded-xl bg-white shadow-sm space-y-6">
          <div className="flex items-center gap-2 text-gray-700">
            <SlidersHorizontal className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Filters</h2>
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-800 mb-2">Genre</h3>

            {genres.map((genre) => (
              <div key={genre.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`genre-${genre.id}`}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={selectedCategories.includes(genre.id)}
                  onChange={() => toggleCategory(genre.id)}
                />
                <label
                  htmlFor={`genre-${genre.id}`}
                  className="text-sm text-gray-700 font-medium leading-none"
                >
                  {genre.name}
                </label>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h3 className="text-sm font-medium text-gray-800 mb-2">Format</h3>
            {formats.map((format) => (
              <div key={format.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`format-${format.value}`}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                  checked={selectedFormat.includes(format.value)}
                  onChange={() => toggleFormat(format.value)}
                />
                <label
                  htmlFor={`format-${format.value}`}
                  className="text-sm text-gray-600 font-medium leading-none"
                >
                  {format.name}
                </label>
              </div>
            ))}
          </div>

          <div className="flex justify-between gap-2 pt-2">
            <button
              className="w-1/2 px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              onClick={() => clear()}
            >
              Clear
            </button>
            <button
              className="w-1/2 px-4 py-2 text-sm bg-primary text-white rounded-lg hover:bg-primary/90 transition"
              onClick={() => applyFilter()}
            >
              Apply
            </button>
          </div>
        </div>
      </aside>

      <main className="flex-1">
        <div className="flex justify-end mb-4 items-center gap-2">
          <h3 className="text-sm font-medium text-gray-600">Sort by</h3>
          <Select onValueChange={applySort}>
            <SelectTrigger className="h-8 w-[140px] text-sm px-2 py-1">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent className="text-sm">
              <SelectItem value="price">Price</SelectItem>
              <SelectItem value="publishDate">Publish Date</SelectItem>
              <SelectItem value="title">Title</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Book Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {currentBooks.length > 0 ? (
            currentBooks.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                isWished={wishlistBookIds.has(book.id)}
              />
            ))
          ) : (
            <p className="col-span-full text-center text-gray-500">
              No books found.
            </p>
          )}
        </div>

        {/* Pagination */}
        {bookList.length > booksPerPage && (
          <Pagination className="mt-8 justify-center">
            <PaginationContent className="flex items-center gap-4">
              <PaginationItem>
                <PaginationPrevious
                  onClick={handlePrevious}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <PaginationItem>
                <PaginationNext
                  onClick={handleNext}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </main>
    </div>
  );
};

export default Books;
