import { Bookmark, Search } from "lucide-react";
import { CgShoppingBag } from "react-icons/cg";
import { FaRegUser } from "react-icons/fa6";
import React, { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import LoginDialog from "@/components/dialog/LoginDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

import { UserContext } from "@/context/UserContext";
import { useForm } from "react-hook-form";
import { baseUrl } from "@/config";
import toast from "react-hot-toast";

const Navbar = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const navigate = useNavigate();
  const { user, setUser } = useContext(UserContext);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (inputData) => {
    const response = await fetch(`${baseUrl}/books/search`, {
      method: "POST",
      body: JSON.stringify(inputData),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (data.success) {
      navigate("/books", { state: { searchedBooks: data.data } });
    } else {
      toast.error(data.message);
    }
  };

  return (
    <>
      <LoginDialog
        isLoginModalOpen={isLoginModalOpen}
        setIsLoginModalOpen={setIsLoginModalOpen}
      />
      <div className="sticky top-0 z-50 w-full bg-white text-gray-800 shadow-md">
        <div className="flex h-[70px] items-center mx-auto justify-between p-4 max-w-7xl">
          <div className="flex items-center gap-10">
            <Link className="items-center" to="/">
              <span className="text-3xl font-semibold text-gray-700">
                Pustak Pasal
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `text-lg font-medium transition-colors hover:underline underline-offset-4 
                            ${
                              isActive
                                ? "text-primary underline underline-offset-4 "
                                : ""
                            }`
                }
              >
                Home
              </NavLink>
              <NavLink
                to="/books"
                className={({ isActive }) =>
                  `text-lg font-medium transition-colors hover:underline underline-offset-4 
                            ${
                              isActive
                                ? "text-primary underline underline-offset-4"
                                : ""
                            }`
                }
              >
                <HoverCard>
                  <HoverCardTrigger> Browse Books</HoverCardTrigger>
                  <HoverCardContent>
                    <p>All Books</p>
                    <p>Bestsellers</p>
                    <p>Award Winners</p>
                    <p>New Releases New</p>
                    <p>Deals</p>
                  </HoverCardContent>
                </HoverCard>
              </NavLink>
            </nav>
          </div>

          <div className="flex item-center gap-6">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex items-center w-64 border border-gray-400 rounded-md overflow-hidden shadow-sm"
            >
              <input
                type="text"
                placeholder="Search books..."
                className="flex-1 px-3 py-1.5 outline-none text-sm"
                {...register("search")}
              />
              <button
                type="submit"
                className="px-3 text-gray-500 hover:text-gray-700"
              >
                <Search size={15} />
              </button>
            </form>

            <div className="flex items-center text-gray-800 gap-3 sm:gap-4">
              <div className="relative">
                <CgShoppingBag
                  size={25}
                  className="cursor-pointer text-gray-600"
                  onClick={() => navigate("/cart")}
                />
              </div>
              <Bookmark
                size={25}
                className="cursor-pointer text-gray-600"
                onClick={() => navigate("/wishlist")}
              />

              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger>
                    <img
                      src="/user.jpg"
                      alt="user"
                      className="h-8 w-8 rounded-full border-2 border-gray-200 shadow-md hover:border-gray-300 transition duration-300"
                    />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="mt-2 w-48 rounded-lg border border-gray-300 bg-white shadow-lg transition-all duration-200 ease-in-out">
                    {/* <DropdownMenuLabel className="px-4 py-2 text-lg font-semibold text-gray-700">
                      My Account
                    </DropdownMenuLabel> */}
                    {/* <DropdownMenuSeparator className="border-t border-gray-200" /> */}
                    <DropdownMenuItem
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out"
                      onClick={() => navigate("/orders")}
                    >
                      Orders
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition duration-150 ease-in-out"
                      onClick={() => {
                        setUser(null);
                        localStorage.removeItem("token");
                        toast.success("Logout successful");
                      }}
                    >
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <FaRegUser
                  size={23}
                  className="cursor-pointer text-gray-600 hover:text-gray-800 transition duration-200 ease-in-out"
                  onClick={() => setIsLoginModalOpen(true)}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
