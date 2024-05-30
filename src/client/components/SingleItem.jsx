// import stuff

import { useNavigate } from "react-router-dom";

// the main page stuff
export default function SingleItem() {
  const navigate = useNavigate()
  console.log("hello world!");
  return (
    <>
      <button onClick={() => navigate('/')}>Back to all items</button>
    </>
  );
}
