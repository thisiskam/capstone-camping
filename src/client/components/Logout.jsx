//import some stuff
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function Logout() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem("token"));

  // console.log("value of token in loggout", localStorage.getItem("token"));
  async function handleClick() {
    try {
      setToken(localStorage.removeItem("token"));
      navigate("/");
    } catch (error) {
      // console.error("error in logout", error);
    }
  }
  return (
    <>
      <button onClick={handleClick}>LOGOUT</button>
    </>
  );
}
