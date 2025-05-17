import { Routes, Route } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import Home from "./pages/Home";
import { Toaster as HotToaster } from "react-hot-toast";
import BookDetails from "./pages/BookDetails";
import Books from "./pages/Books";
import MainLayout from "./layout/user/MainLayout";
import AdminLayout from "./layout/admin/AdminLayout";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminBooks from "./pages/Admin/AdminBooks ";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AddBook from "./pages/Admin/AddBook";
import UpdateBook from "./pages/Admin/UpdateBook";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import AdminGenres from "./pages/Admin/AdminGenres";
import AdminOrder from "./pages/Admin/AdminOrder";
import Orders from "./pages/Orders";
import UserProvider from "./context/UserContext";
import OrderDetails from "./pages/OrderDetails";
import Banner from "./pages/Admin/Banner";
import { Toaster as ShadcnToaster } from "@/components/ui/toaster";
import AdminOrderItems from "./pages/Admin/AdminOrderItems";
import AdminBookDetail from "./pages/Admin/AdminBookDetail";

function App() {
  const queryClient = new QueryClient();
  return (
    <>
      <HotToaster />
      <ShadcnToaster />
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <Routes>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Home />} />
              <Route path="/books" element={<Books />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/books/:bookId" element={<BookDetails />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/items/:orderId" element={<OrderDetails />} />
            </Route>

            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminGenres />} />
              <Route path="/admin/gernres" element={<AdminGenres />} />
              <Route path="/admin/books" element={<AdminBooks />} />
              <Route
                path="/admin/book/detail/:bookId"
                element={<AdminBookDetail />}
              />
              <Route path="/admin/orders" element={<AdminOrder />} />
              <Route
                path="/admin/orders/items/:orderId"
                element={<AdminOrderItems />}
              />
              <Route path="/admin/book/add" element={<AddBook />} />
              <Route path="/admin/banners" element={<Banner />} />
              <Route
                path="/admin/book/update/:bookId"
                element={<UpdateBook />}
              />
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </UserProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
