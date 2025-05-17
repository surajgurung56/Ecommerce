import { useNavigate } from "react-router-dom";
import useFetchCart from "@/hooks/useFetchCart";
import { baseUrl } from "@/config";
import { Trash } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import CustomButton from "@/components/ui/CustomButton";
import { useState } from "react";

const Cart = () => {
  const navigate = useNavigate();
  const { data: cart = [] } = useFetchCart();
  const [loading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();

  const removeFromCart = async (id) => {
    try {
      const response = await fetch(`${baseUrl}/cart/${id}`, {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
        queryClient.invalidateQueries({ queryKey: ["carts"] });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    }
  };

  const updateQuantity = async (id, quantity) => {
    if (quantity < 1) return;

    try {
      const response = await fetch(`${baseUrl}/cart/${id}`, {
        method: "PUT",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: ["carts"] });
      } else {
        toast.error(data.message || "Failed to update quantity.");
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    }
  };

  const checkout = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${baseUrl}/order`, {
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
        queryClient.invalidateQueries({ queryKey: ["carts"] });
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto min-h-screen">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart Items Section */}
        <div className="flex-1 bg-white rounded-lg shadow-lg p-6">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">Your cart is empty.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {cart.length > 0 &&
                cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between border-b pb-4 hover:bg-gray-50 transition duration-200"
                  >
                    <div className="flex items-center gap-6">
                      <img
                        src={`${baseUrl}${item.book.imageURL}`}
                        alt={item.book.title}
                        className=" aspect-[10/16] h-20 object-cover rounded-md shadow-sm"
                      />
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {item.book.title}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          by {item.book.author}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <p className="text-lg font-semibold text-gray-900">
                        Rs. {item.book.price}
                      </p>
                      <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-md">
                        <button
                          className="px-3 py-1 text-gray-700 hover:text-gray-900 transition duration-200"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </button>
                        <span className="px-4 text-gray-800">
                          {item.quantity}
                        </span>
                        <button
                          className="px-3 py-1 text-gray-700 hover:text-gray-900 transition duration-200"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="text-red-600 hover:text-red-800 flex items-center gap-2 transition duration-200"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash size={20} />
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Order Summary Section */}
        <div className="lg:w-1/3 bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b-2 border-gray-200 pb-2">
            Order Summary
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal ({cart.length} items)</span>
              <span className="font-medium">
                Rs.{" "}
                {cart.reduce(
                  (total, item) => total + item.book.price * item.quantity,
                  0
                )}
              </span>
            </div>

            <div className="flex justify-between text-gray-900 font-bold text-lg border-t-2 pt-4">
              <span>Total</span>
              <span>
                Rs.{" "}
                {cart.reduce(
                  (total, item) => total + item.book.price * item.quantity,
                  0
                )}
              </span>
            </div>
          </div>

          <CustomButton
            text={loading ? "Loading..." : "Proceed to Checkout"}
            className="w-full mt-6 bg-primary text-white py-3 rounded-md  transition duration-300 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={cart.length === 0}
            loading={loading}
            onClick={() => checkout()}
          />
          <button
            onClick={() => navigate("/books")}
            className="w-full mt-3 bg-gray-200 text-gray-800 py-3 rounded-md hover:bg-gray-300 transition duration-300"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
