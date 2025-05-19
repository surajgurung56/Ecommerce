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
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

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
    accessorKey: "heading",
    header: "Heading",
  },

  {
    accessorKey: "startDate",
    header: "Start Date",
  },

  {
    accessorKey: "endDate",
    header: "End Date",
  },

  {
    header: "Action",
    id: "actions",
    cell: ({ row }) => {
      const banner = row.original;

      const queryClient = useQueryClient();

      const [dropdownOpen, setDropdownOpen] = useState();

      const deleteBanner = async () => {
        try {
          const response = await fetch(`${baseUrl}/banner/${banner.id}`, {
            method: "DELETE",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });

          const result = await response.json();

          if (result.success) {
            toast.success(result.message);
            queryClient.invalidateQueries({ queryKey: ["banners"] });
          } else {
            toast.error(result.message);
          }
        } catch (error) {
          console.error(error);
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
                    deleteBanner();
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
