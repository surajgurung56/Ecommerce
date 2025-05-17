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
import ChangeOrderStatusDialog from "@/components/dialog/ChangeOrderStatusDialog";

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
    accessorKey: "bookTitle",
    header: "Title",
  },

  {
    accessorKey: "quantity",
    header: "Quantity",
  },

  {
    accessorKey: "price",
    header: "Price",
  },

  
];
