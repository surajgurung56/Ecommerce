import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, RotateCcw } from "lucide-react";
import { PiCaretUpDownFill } from "react-icons/pi";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "@/config";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import EditGernereDilog from "@/components/dialog/EditGernereDilog";

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
    accessorKey: "name",
    header: "Name",
  },

  {
    header: "Action",
    id: "actions",
    cell: ({ row }) => {
      const book = row.original;

      const [dropdownOpen, setDropdownOpen] = useState();
      const navigate = useNavigate();
      const queryClient = useQueryClient();

      const [isAddGenreDialogOpen, setIsAddGenreDialogOpen] = useState(false);

      const deletegernne = async () => {
        try {
          const response = await fetch(`${baseUrl}/category/${book.id}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });

          const result = await response.json();

          if (result.success) {
            toast.success(result.message);
            queryClient.invalidateQueries({ queryKey: ["genres"] });
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          console.error("Failed to fetch book:", error);
        }
      };

      return (
        <>
          <EditGernereDilog
            isAddGenreDialogOpen={isAddGenreDialogOpen}
            setIsAddGenreDialogOpen={setIsAddGenreDialogOpen}
            id={book.id}
          />

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
                    setIsAddGenreDialogOpen(true);
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
                    deletegernne();
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors group"
                >
                  <Trash2 className="h-4 w-4 mr-2 text-gray-500 group-hover:text-red-500" />
                  Delete
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
