import { NavLink, Outlet } from "react-router-dom";

export default function LoginLayout() {
  return (
    <div className="login-layout">
      <header>
        <nav>
          <h1>
            <NavLink to="/">CR</NavLink>
          </h1>
          <NavLink to="/login">Login</NavLink>
        </nav>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
