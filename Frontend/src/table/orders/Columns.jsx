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
    header: "Membership ID",
    cell: ({ row }) => {
      const order = row.original;
      return order.user ? order.user.membershipId : "N/A";
    },
  },

  {
    header: "User Name",
    cell: ({ row }) => {
      const order = row.original;
      return order.user ? order.user.name : "N/A";
    },
  },

  {
    accessorKey: "claimCode",
    header: "Claim Code",
  },

  {
    accessorKey: "orderDate",
    header: "Order Date",
  },

  {
    accessorKey: "orderItemCount",
    header: "Total Item",
  },

  {
    accessorKey: "totalAmount",
    header: "Total Amount",
  },

  // {
  //   header: "Order Status",
  //   cell: ({ row }) => {
  //     const order = row.original;
  //     return order.status ? order.status : "N/A";
  //   },
  // },

  {
    header: "Order Status",
    cell: ({ row }) => {
      const order = row.original;
      const status = order.status || "N/A";

      const statusMap = {
        PENDING: "bg-yellow-200 text-yellow-800",
        CONFIRMED: "bg-blue-200 text-blue-800",
        READY_FOR_PICKUP: "bg-purple-200 text-purple-800",
        COMPLETED: "bg-green-200 text-green-800",
        CANCELLED: "bg-red-200 text-red-800",
        "N/A": "bg-gray-200 text-gray-700",
      };

      const statusClass = statusMap[status] || "bg-gray-200 text-gray-700";

      return (
        <span
          className={`px-3 py-1 rounded-2xl text-sm font-medium ${statusClass}`}
        >
          {status.replace(/_/g, " ")}
        </span>
      );
    },
  },
  {
    header: "Action",
    id: "actions",
    cell: ({ row }) => {
      const order = row.original;
      const navigate = useNavigate();
      const [dropdownOpen, setDropdownOpen] = useState();

      const [isDialogOpen, setIsDialogOpen] = useState(false);

      return (
        <>
          <ChangeOrderStatusDialog
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
            id={order.id}
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
                    navigate(`/admin/orders/items/${order.id}`);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Eye className="h-4 w-4 mr-2 text-gray-500" />
                  View Items
                </button>
              </DropdownMenuItem>

              <DropdownMenuItem className="p-0">
                <button
                  onClick={() => {
                    setDropdownOpen(false);
                    setIsDialogOpen(true);
                  }}
                  className="flex items-center w-full px-3 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <Edit className="h-4 w-4 mr-2 text-gray-500" />
                  Change Status
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      );
    },
  },
];
