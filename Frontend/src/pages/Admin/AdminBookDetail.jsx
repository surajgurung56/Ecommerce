import {
  ArrowLeft,
  Book,
  Tag,
  Calendar,
  ShoppingCart,
  Languages,
  Building,
  Percent,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { baseUrl } from "@/config";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function AdminBookDetail() {
  const { bookId } = useParams();
  const [book, setBook] = useState({});

  const getBook = async () => {
    try {
      const response = await fetch(`${baseUrl}/book/${bookId}`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        setBook(data?.data);
      } else {
        toast.error(data.message || "Failed to fetch book.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    }
  };

  useEffect(() => {
    getBook();
  }, []);

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-1">
          <CardContent className="pt-6">
            <div className="aspect-[3/4] relative overflow-hidden rounded-md mb-4">
              <img
                src={`${baseUrl}${book.imageURL}`}
                alt="book cover page"
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex flex-col gap-2 mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">ID:</span>
                <span className="text-sm">{book.id || ""}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Added Date:</span>
                <span className="text-sm">{book.addedDate || ""}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Format:</span>
                <Badge variant="outline" className="capitalize">
                  {book.format || ""}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>{book.title || ""}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Book className="h-4 w-4" /> Author
                  </label>
                  <p>{book.author || ""}</p>
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4" /> ISBN
                  </label>
                  <p>{book.isbn || ""}</p>
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" /> Published Date
                  </label>
                  <p>{book.publishedDate || ""}</p>
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Building className="h-4 w-4" /> Publisher
                  </label>
                  <p>{book.publicationName || ""}</p>
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Languages className="h-4 w-4" /> Language
                  </label>
                  <p>{book.language || ""}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" /> Stock
                  </label>
                  <p>{book.stock || ""} units</p>
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Tag className="h-4 w-4" /> Price
                  </label>
                  <p className="font-semibold mt-2 text-gray-900">
                    {book.discountPercentage &&
                    new Date(book.discountStartDate) <= new Date() &&
                    new Date(book.discountEndDate) >= new Date() ? (
                      <>
                        <span className="line-through text-gray-500 mr-2">
                          Rs. {book.price}
                        </span>
                        <span>
                          Rs.{" "}
                          {Math.round(
                            book.price * (1 - book.discountPercentage / 100)
                          )}
                        </span>
                      </>
                    ) : (
                      <>Rs. {book.price || 0}</>
                    )}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium flex items-center gap-2">
                    <Percent className="h-4 w-4" /> Discount
                  </label>
                  <p>{book.discountPercentage || ""}%</p>
                </div>

                <div>
                  <label className="text-sm font-medium">Discount Period</label>
                  <p>
                    {book.discountStartDate} - {book.discountEndDate || ""}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">Category</label>
                  <div>
                    <Badge>{book.category?.name || ""}</Badge>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <label className="text-sm font-medium">Description</label>
              <p className="mt-2">{book.description || ""}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
