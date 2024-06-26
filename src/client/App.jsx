// import { useState } from "react";

// import tools we need to use
import {
  createBrowserRouter,
  Route,
  createRoutesFromElements,
  RouterProvider,
} from "react-router-dom";

//import components necessary for routing and other stuff
import CR from "./components/CR";
import Login from "./components/Login";
import SingleItem from "./components/SingleItem";
import Register from "./components/Register";
import Account from "./components/Account";
import AllUsers from "./components/AllUsers";
import AdminItems from "./components/AdminItems";
import AddItem from "./components/AddItem";
import AddUser from "./components/AddUser";
import UpdateUser from "./components/UpdateUser";

// bring in the layouts
import RootLayout from "./layouts/RootLayout";

//define your router
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<RootLayout />}>
        <Route index element={<CR />} />
        <Route path="items/:id" element={<SingleItem />} />
        <Route path="account" element={<Account />} />
        <Route path="login" element={<Login />} />
        <Route path="login/register" element={<Register />} />
        <Route path="allusers" element={<AllUsers />} />
        <Route path="allusers/adduser" element={<AddUser />} />
        <Route path="allusers/:id" element={<UpdateUser />} />
        <Route path="adminitems" element={<AdminItems />} />
        <Route path="adminitems/additem" element={<AddItem />} />
        {/* <Route path="register" element={<Register />} /> */}
        {/* <Route path="login/register" element={<Register />} /> */}
      </Route>
    </>
  )
);

//wrap the router in the RouterProvider
function App() {
  // const [count, setCount] = useState(0);
  return (
    <>
      <RouterProvider router={router}>
        {/* <Register /> */}
        <Account />
      </RouterProvider>
    </>
  );
}

export default App;
