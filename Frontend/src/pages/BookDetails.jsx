import { useEffect, useState } from "react";
import {
  Bookmark,
  Heart,
  MessageSquare,
  Minus,
  Plus,
  ShoppingCart,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { baseUrl } from "@/config";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import useFetchWishlist from "@/hooks/useFetchWishlist";

export default function BookDetails() {
  const [book, setBook] = useState({});
  const [reviews, setReviews] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const { bookId } = useParams();
  const queryClient = useQueryClient();

  const { data: Wishlist = [] } = useFetchWishlist();
  const wishlistBookIds = new Set(Wishlist.map((item) => item.bookId));
  const isInWishlist = wishlistBookIds.has(Number(bookId));

  console.log("Wishlist:", Wishlist);
  console.log("wishlistBookIds (Set of bookIds):", wishlistBookIds);
  console.log("isInWishlist (Is the book in the wishlist?):", isInWishlist);
  console.log("bookId (Current book ID):", bookId);

  const handleAddToCart = async () => {
    try {
      const response = await fetch(`${baseUrl}/cart`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          bookId: bookId,
          quantity: quantity,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await fetch(`${baseUrl}/wishlist/${book.id}`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["wishlists"] });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    }
  };

  const getBook = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/book/${bookId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const result = await response.json();

      if (result.success) {
        setBook(result.data);
        setReviews(result.data?.reviews || []);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getBook();
  }, [bookId]);

  const isOnSale =
    book.discountPercentage &&
    book.isOnSale &&
    new Date(book.discountStartDate) <= new Date() &&
    new Date(book.discountEndDate) >= new Date();

  const discountedPrice = isOnSale
    ? Math.round(book.price * (1 - book.discountPercentage / 100))
    : book.price;

  const incrementQuantity = () => setQuantity((prev) => prev + 1);
  const decrementQuantity = () =>
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, review) => sum + review.rating, 0) /
          reviews.length
        ).toFixed(1)
      : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <>
        <div className="grid md:grid-cols-[350px_1fr] gap-8 lg:gap-12">
          <div className="relative">
            <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-center h-full">
              <img
                src={`${baseUrl}${book.imageURL}`}
                alt={book.title}
                className="object-contain max-h-[500px] w-auto shadow-md"
              />
              {isOnSale && (
                <div className="absolute top-0 left-0">
                  <img src="/sale.png" alt="Sale" className="w-[40%]" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex flex-wrap gap-2 mb-3">
                {book.format && (
                  <Badge variant="outline" className="text-xs font-medium">
                    {book.format}
                  </Badge>
                )}
                {book?.category?.name && (
                  <Badge variant="outline" className="text-xs font-medium">
                    {book.category.name}
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-2 text-gray-900">
                {book.title || ""}
              </h1>
              <p className="text-xl text-gray-700 mb-4">
                by {book.author || ""}
              </p>

              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={
                            i < Math.round(averageRating)
                              ? "h-5 w-5 text-yellow-400 fill-yellow-400"
                              : "h-5 w-5 text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="ml-2 font-medium">{averageRating}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-gray-600">
                  <MessageSquare className="h-5 w-5" />
                  <span>{reviews.length} Reviews</span>
                </div>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  {isOnSale ? (
                    <>
                      <span className="line-through text-gray-500 text-lg">
                        Rs. {book.price}
                      </span>
                      <span className="text-2xl font-bold text-red-600">
                        Rs. {discountedPrice}
                      </span>
                      <Badge className="ml-2 bg-red-600">
                        {book.discountPercentage}% OFF
                      </Badge>
                    </>
                  ) : (
                    <span className="text-2xl font-bold text-gray-900">
                      Rs. {book.price || 0}
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                {book.isbn && (
                  <div>
                    <span className="text-sm text-gray-500">ISBN</span>
                    <p className="font-medium">{book.isbn}</p>
                  </div>
                )}
                {book.language && (
                  <div>
                    <span className="text-sm text-gray-500">Language</span>
                    <p className="font-medium">{book.language}</p>
                  </div>
                )}
                {book.publicationName && (
                  <div>
                    <span className="text-sm text-gray-500">Publisher</span>
                    <p className="font-medium">{book.publicationName}</p>
                  </div>
                )}
                {book.publishedDate && (
                  <div>
                    <span className="text-sm text-gray-500">
                      Published Date
                    </span>
                    <p className="font-medium">
                      {new Date(book.publishedDate).toLocaleDateString()}
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-6 mb-6">
                <div>
                  <span className="text-sm text-gray-500 block mb-2">
                    Quantity
                  </span>
                  <div className="flex items-center border border-gray-300 rounded-md">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-none border-r border-gray-300"
                      onClick={decrementQuantity}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <span className="w-10 text-center font-medium">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-none border-l border-gray-300"
                      onClick={incrementQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <Button
                  className="bg-primary text-white px-8 py-6 rounded-md"
                  onClick={() => handleAddToCart()}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className={
                    isInWishlist
                      ? "h-12 w-12 rounded-md border-yellow-400 bg-yellow-400"
                      : "h-12 w-12 rounded-md border-gray-300"
                  }
                  onClick={() => handleAddToWishlist()}
                >
                  <Bookmark className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-4">Book Description</h2>
          <Separator className="mb-4" />
          <div className="prose max-w-none">
            <p className="text-gray-700 leading-relaxed">
              {book.description || "No description available."}
            </p>
          </div>
        </div>

        {reviews?.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
            <Separator className="mb-6" />

            <div className="space-y-6">
              {reviews.map((review) => (
                <Card key={review.id} className="border-gray-200">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold text-gray-900">
                        {review.applicationUser?.name || "Anonymous"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < review.rating
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }
                        />
                      ))}
                    </div>

                    <p className="text-gray-700">{review.comment}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </>
    </div>
  );
}
