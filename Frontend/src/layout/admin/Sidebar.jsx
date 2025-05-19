import { NavLink } from "react-router-dom";
import { Tags, Book, ShoppingBag, Info, LogOut } from "lucide-react";

const Sidebar = () => {
  return (
    <div
      className={`fixed top-0 left-0 z-40 h-screen bg-primary transition-transform duration-300 ease-in-out text-white p-4 w-64 `}
    >
      <div className="flex flex-col h-full justify-between">
        <div>
          <div className="flex items-center  gap-3 mb-4">
            <img src="/logo.png" alt="" className="w-10 h-10" />
            <span className="font-semibold text-2xl">Pustak Pasal.</span>
          </div>

          <div className="flex flex-col gap-6 overflow-y-auto">
            <div className="flex flex-col gap-1">
              <NavLink
                to="/admin/gernres"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 px-4 py-3 rounded-md text-base transition-colors bg-white/10 text-white"
                    : "flex items-center gap-3 px-4 py-3 rounded-md text-base transition-colors text-gray-300 hover:bg-white/10 hover:text-white"
                }
              >
                <Tags size={20} />
                <span>Gernres</span>
              </NavLink>

              <NavLink
                to="/admin/books"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 px-4 py-3 rounded-md text-base transition-colors bg-white/10 text-white"
                    : "flex items-center gap-3 px-4 py-3 rounded-md text-base transition-colors text-gray-300 hover:bg-white/10 hover:text-white"
                }
              >
                <Book size={20} />
                <span>Books</span>
              </NavLink>

              <NavLink
                to="/admin/orders"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 px-4 py-3 rounded-md text-base transition-colors bg-white/10 text-white"
                    : "flex items-center gap-3 px-4 py-3 rounded-md text-base transition-colors text-gray-300 hover:bg-white/10 hover:text-white"
                }
              >
                <ShoppingBag size={20} />
                <span>Order</span>
              </NavLink>

              <NavLink
                to="/admin/banners"
                className={({ isActive }) =>
                  isActive
                    ? "flex items-center gap-3 px-4 py-3 rounded-md text-base transition-colors bg-white/10 text-white"
                    : "flex items-center gap-3 px-4 py-3 rounded-md text-base transition-colors text-gray-300 hover:bg-white/10 hover:text-white"
                }
              >
                <Info size={20} />
                <span>Banner Announcement</span>
              </NavLink>
            </div>
          </div>
        </div>
        <button className="flex items-center gap-3 px-4 py-3 rounded-md text-base transition-colors text-gray-300 hover:bg-white/10 hover:text-white">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
