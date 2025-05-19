// import { UserContext } from "@/context/UserContext";
// import { useContext } from "react";
// import { Navigate, Outlet } from "react-router-dom";

// export default function PrivateRoute() {
//   const { user, loading } = useContext(UserContext);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   return user ? <Outlet /> : <Navigate to="/" />;
// }

import { UserContext } from "@/context/UserContext";
import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function PrivateRoute() {
  const { user, loading } = useContext(UserContext);
  const [redirecting, setRedirecting] = useState(false);

  useEffect(() => {
    if (!loading && !user && !redirecting) {
      toast.error("Login is required");
      setRedirecting(true);
    }
  }, [loading, user, redirecting]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return user ? <Outlet /> : <Navigate to="/" />;
}
