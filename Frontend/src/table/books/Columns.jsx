import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  RotateCcw,
  X,
  Tag,
} from "lucide-react";
import { PiCaretUpDownFill } from "react-icons/pi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "@/config";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";

export const columns = [
  {
    accessorKey: "id",
    header: ({ column }) => {
      return (
        <span
          className="flex items-center cursor-pointer"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          ID
          <PiCaretUpDownFill className="ml-2 h-4 w-4" />
        </span>
      );
    },
  },

  {
    header: "Image",
    cell: ({ row }) => {
      const book = row.original;
      return (
        <img
          src={`${baseUrl}${book.imageURL}`}
          alt={book.name}
          referrerPolicy="no-referrer"
          className="h-8 aspect-[10/16] object-cover border border-gray-100"
        />
      );
    },
  },

  {
    accessorKey: "title",
    header: "Title",
  },

  {
    accessorKey: "author",
    header: "Author",
  },

  {
    accessorKey: "isbn",
    header: "ISBN",
  },

  {
    accessorKey: "stock",
    header: "Stock",
  },

  {
    accessorKey: "price",
    header: "Price",
  },

  {
    accessorKey: "category.name",
    header: "Genre",
  },

  {
    accessorKey: "publishedDate",
    header: "Published Date",
  },

  {
    accessorKey: "format",
    header: "Format",
  },

  {
    header: "Action",
    id: "actions",
    cell: ({ row }) => {
      const book = row.original;

      const [dropdownOpen, setDropdownOpen] = useState();
      const navigate = useNavigate();
      const queryClient = useQueryClient();

      const deleteBook = async () => {
        try {
          const response = await fetch(`${baseUrl}/book/${book.id}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });

          const result = await response.json();

          if (result.success) {
            toast.success(result.message);
            queryClient.invalidateQueries({ queryKey: ["books"] });
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          console.error("Failed to fetch book:", error);
        }
      };

      const toggleSale = async () => {
        try {
          const response = await fetch(
            `${baseUrl}/books/${book.id}/toggle-sale`,
            {
              method: "PATCH",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
              },
            }
          );

          const result = await response.json();

          if (result.success) {
            toast.success(result.message);
            queryClient.invalidateQueries({ queryKey: ["books"] });
          }
        } catch (error) {
          console.error("Failed to fetch book:", error);
        }
      };

      return (
        <>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger asChild>
              <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                <MoreHorizontal className="h-5 w-5 text-gray-600" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 p-1">
              <DropdownMenuItem className="p-0">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate(`/admin/book/detail/${book.id}`);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2 text-gray-500" />
                  View details
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem className="p-0">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    navigate(`/admin/book/update/${book.id}`);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2 text-gray-500" />
                  Edit
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem className="p-0">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    deleteBook();
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors group"
                >
                  <Trash2 className="h-4 w-4 mr-2 text-gray-500 group-hover:text-red-500" />
                  Delete
                </button>
              </DropdownMenuItem>

              {book.discountPercentage &&
                new Date(book.discountStartDate) <= new Date() &&
                new Date(book.discountEndDate) >= new Date() && (
                  <DropdownMenuItem className="p-0">
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        toggleSale();
                      }}
                      className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors group"
                    >
                      {book.isOnSale ? (
                        <>
                          <X className="h-4 w-4 mr-2 text-gray-500 group-hover:text-blue-600" />
                          Remove Sale
                        </>
                      ) : (
                        <>
                          <Tag className="h-4 w-4 mr-2 text-gray-500 group-hover:text-blue-600" />
                          Put On Sale
                        </>
                      )}
                    </button>
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
