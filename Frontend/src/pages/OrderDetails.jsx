import { baseUrl } from "@/config";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Star } from "lucide-react";
import ReviewDialog from "@/components/dialog/ReviewDialog";
import useFetchOrderItems from "@/hooks/useFetchOrderItems";

const OrderDetails = () => {
  const { orderId } = useParams();
  const { data: order, isLoading, isError } = useFetchOrderItems(orderId);

  const [isOpenReviewDialog, setIsOpenReviewDialog] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const orderItems = order?.orderItems || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-48 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 w-full max-w-2xl bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center p-6 bg-red-50 rounded-lg border border-red-100">
          <h2 className="text-xl font-semibold text-red-700 mb-2">
            Failed to load order details.
          </h2>
          <p className="text-red-600">Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!orderItems.length) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center p-6 bg-gray-50 rounded-lg border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            No Items Found
          </h2>
          <p className="text-gray-600">This order doesn't contain any items.</p>
        </div>
      </div>
    );
  }

  const orderTotal = orderItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <>
      <ReviewDialog
        isDialogOpen={isOpenReviewDialog}
        setIsDialogOpen={setIsOpenReviewDialog}
        bookId={selectedBookId}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-6">
          {orderItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
            >
              <div className="p-4 md:p-6 flex flex-col md:flex-row gap-6">
                <div className="flex-shrink-0">
                  <div className="relative w-full md:w-32 h-40 bg-gray-100 rounded-md overflow-hidden cursor-pointer">
                    <img

                   
                      src={`${baseUrl}${item?.imageURL || ""}`}
                      alt={item.bookTitle}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>

                <div className="flex-grow flex flex-col">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">
                    {item.bookTitle}
                  </h3>
                  <p className="text-gray-600 mb-4">by {item.bookAuthor}</p>

                  <div className="flex flex-col gap-1 mb-auto">
                    <span className="text-sm text-gray-700">
                      <span className="font-medium">ISBN:</span> {item.isbn}
                    </span>
                  </div>

                  <div className="flex flex-wrap justify-between items-end mt-auto">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          Qty: {item.quantity}
                        </span>
                        <span className="text-sm text-gray-600">×</span>
                        <span className="text-sm text-gray-600">
                          Rs. {item.price}
                        </span>
                      </div>
                      <div className="font-bold text-lg">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                    {order.status === "COMPLETED" && !item.isReviewed && (
                      <button
                        className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-md transition-colors"
                        onClick={() => {
                          setSelectedBookId(item.bookId);
                          setIsOpenReviewDialog(true);
                        }}
                      >
                        <Star className="h-4 w-4" />
                        <span>Write a Review</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-right font-semibold text-lg">
          Order Total: Rs. {orderTotal.toFixed(2)}
        </div>
      </div>
    </>
  );
};

export default OrderDetails;
