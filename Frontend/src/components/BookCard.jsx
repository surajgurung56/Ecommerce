import { Bookmark, BookmarkCheck } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "@/config";
import { useQueryClient } from "@tanstack/react-query";

const BookCard = ({ book, isWished }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

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
          bookId: book.id,
          quantity: 1,
        }),
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Login is required.");
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
      toast.error("Login is required.");
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col group hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
      <div onClick={() => navigate(`/books/${book.id}`)}>
        <div className="h-80 mb-4 overflow-hidden rounded shadow-md relative">
          <img
            src={`${baseUrl}${book.imageURL}`}
            alt="cover image"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div
            className={`absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-md hover:shadow-lg ${
              isWished ? "text-primary" : "text-gray-400 hover:text-primary"
            } transition-all cursor-pointer z-10`}
            onClick={(e) => {
              e.stopPropagation();
              handleAddToWishlist();
            }}
          >
            {isWished ? <BookmarkCheck size={20} /> : <Bookmark size={20} />}
          </div>

          {book.discountPercentage &&
            new Date(book.discountStartDate) <= new Date() &&
            new Date(book.discountEndDate) >= new Date() && (
              <div className={`absolute top-0 left-0 `}>
                <img src="/sale.png" alt="Sale" className="w-[40%]" />
              </div>
            )}
        </div>

        <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
          {book.title || "hello"}
        </h3>
        <p className="text-gray-600 text-xs mt-1">
          by {book.author || "hello"}
        </p>
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
                {Math.round(book.price * (1 - book.discountPercentage / 100))}
              </span>
            </>
          ) : (
            <>Rs. {book.price || 0}</>
          )}
        </p>
      </div>
      <button
        className="mt-3 border border-gray-300 py-2 text-sm text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors w-full rounded"
        onClick={handleAddToCart}
      >
        ADD TO CART
      </button>
    </div>
  );
};

export default BookCard;

// import { Bookmark } from "lucide-react";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";
// import useCartStore from "../../src/components/store/useCartStore";
// import { baseUrl } from "@/config";
// import { useQueryClient } from "@tanstack/react-query";

// const BookCard = ({ book }) => {
//   const navigate = useNavigate();
//   const { addToCart, addToWishlist } = useCartStore();

//   const queryClient = useQueryClient();

//   const handleAddToCart = () => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       toast.error("Please log in to add items to your cart.");
//       setIsLoginModalOpen(true); // Open the login dialog
//       return;
//     }
//     addToCart(book);
//     toast.success("Added to Cart!");
//   };

//   const handleAddToWishlist = async () => {
//     try {
//       const response = await fetch(`${baseUrl}/wishlist/${book.id}`, {
//         method: "POST",
//         headers: {
//           Accept: "application/json",
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${localStorage.getItem("token")}`,
//         },
//       });

//       const data = await response.json();

//       if (data.success) {
//         toast.success(data.message);
//         queryClient.invalidateQueries({ queryKey: ["wishlists"] });
//       } else {
//         toast.error(data.message);
//       }
//     } catch (error) {
//       toast.error("Something went wrong.");
//       console.error(error);
//     }
//   };

//   return (
//     <div className="flex flex-col group hover:-translate-y-1 transition-transform duration-300 cursor-pointer">
//       <div onClick={() => navigate(`/books/${book.id}`)}>
//         <div className="h-80 mb-4 overflow-hidden rounded shadow-md relative">
//           <img
//             src={`${baseUrl}${book.imageURL}`}
//             alt="Bhagavad Gita As It Is"
//             className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//           />
//           <div
//             className="absolute top-0 right-2 text-gray-600 group-hover:text-blue-600 transition-colors"
//             onClick={(e) => {
//               e.stopPropagation();
//               handleAddToWishlist();
//             }}
//           >
//             <Bookmark size={30}  className="bg-white p-2 rounded-full shadow-md hover:bg-blue-600 hover:text-white transition-all duration-300"/>
//           </div>
//         </div>

//         <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
//           {book.title || "hello"}
//         </h3>
//         <p className="text-gray-600 text-xs mt-1">
//           by {book.author || "hello"}
//         </p>
//         <p className="font-semibold mt-2 text-gray-900">
//           Rs. {book.price || 0}
//         </p>
//       </div>
//       <button
//         className="mt-3 border border-gray-300 py-2 text-sm text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors w-full rounded"
//         onClick={handleAddToCart}
//       >
//         ADD TO CART
//       </button>
//     </div>
//   );
// };

// export default BookCard;
