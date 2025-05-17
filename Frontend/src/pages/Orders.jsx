import { baseUrl } from "@/config";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCcw,
} from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const statusConfig = {
  PENDING: {
    color: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    icon: Clock,
  },
  PROCESSING: {
    color: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    icon: RefreshCcw,
  },
  COMPLETED: {
    color: "bg-green-100 text-green-800 hover:bg-green-100",
    icon: CheckCircle,
  },
  CANCELLED: {
    color: "bg-red-100 text-red-800 hover:bg-red-100",
    icon: AlertCircle,
  },
};

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const cancleOrder = async (orderId) => {
    try {
      const response = await fetch(`${baseUrl}/order/cancel/${orderId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        getOrders();
      }
    } catch (err) {
      toast.error("Some thing went wrong.");
      console.log(err);
    }
  };

  const getOrders = async () => {
    try {
      const response = await fetch(`${baseUrl}/orders`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-lg">
        <h2 className="text-xl font-bold text-red-800 mb-2">
          Error Loading Orders
        </h2>
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      {orders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <Package className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-semibold mb-2">No orders yet</h3>
            <p className="text-muted-foreground text-center max-w-md">
              When you place your first order, it will appear here for you to
              track and review.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {orders.map((order) => {
            const StatusIcon = statusConfig[order.status]?.icon || Clock;
            const statusColor =
              statusConfig[order.status]?.color ||
              "bg-gray-100 text-gray-800 hover:bg-gray-100";

            return (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        Order #{order.id}
                      </CardTitle>
                      <CardDescription>{order.orderDate}</CardDescription>
                    </div>
                    <Badge className={statusColor} variant="secondary">
                      <StatusIcon className="h-3.5 w-3.5 mr-1" />
                      {order.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Amount:
                      </span>
                      <span className="font-medium">
                        RS. {order.totalAmount}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Claim Code:</span>
                      <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                        {order.claimCode}
                      </span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between items-center border-t bg-muted/50 pt-3">
                  <button
                    className="text-sm font-medium text-primary hover:underline"
                    onClick={() => navigate(`/orders/items/${order.id}`)}
                  >
                    View Order Details
                  </button>

                  {order.status !== "CANCELLED" &&
                    order.status !== "COMPLETED" && (
                      <button
                        className="text-sm font-medium text-red-600 hover:underline"
                        onClick={() => cancleOrder(order.id)}
                      >
                        Cancel
                      </button>
                    )}
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
