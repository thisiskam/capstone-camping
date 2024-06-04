import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function RootLayout() {
  const navigate = useNavigate();
  const isLoggedIn = () => {
    const token = localStorage.getItem("token");
    if (token) {
      return true;
    } else {
      return false;
    }
  };
  useEffect(() => {
    if (!isLoggedIn() && window.location.pathname === "/account") {
      navigate("/login");
    }
  }, [navigate]);
  return (
    <>
      <div className="root-layout">
        <header>
          <nav>
            <h1>
              <NavLink to="/">CR</NavLink>
            </h1>
            {isLoggedIn() ? (
              <>
                <NavLink to="/account">ACCOUNT</NavLink>
              </>
            ) : (
              <>
                <NavLink to="/login">LOGIN</NavLink>
                {/* <NavLink to="/register">REGISTER HERE</NavLink> */}
              </>
            )}
          </nav>
        </header>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
}

// const RootLayout = ({ isLoggedIn }) => {
//   const navigate = useNavigate();
//   return (
//     <div>
//       {!token ? (
//         <div className="root-layout">
//           <header>
//             <nav>
//               <h1>
//                 <NavLink to="/">CR</NavLink>
//               </h1>
//               <NavLink to="login">Login</NavLink>
//             </nav>
//           </header>
//           <main>
//             <Outlet />
//           </main>
//         </div>
//       ) : (
//         <div>
//           <header>
//             <nav>
//               <h1>
//                 <NavLink to="/">CR</NavLink>
//               </h1>
//               <NavLink to="account">Account</NavLink>
//             </nav>
//           </header>
//           <main>
//             <Outlet />
//           </main>
//         </div>
//       )}
//     </div>
//   );
// };

// export default RootLayout;
