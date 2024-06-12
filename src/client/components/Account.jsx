// import stuff
import Logout from "./Logout";

// the main page stuff
export default function Account() {
  console.log("i see dead ppl");
  if (localStorage.getItem("token") === null) {
    return (
      <>
        <h1>Account</h1>
        <h2>Log in to view your account</h2>
      </>
    );
  }
  const handleLogout = async () => {
    try {
      console.log("love coding");
      const response = await fetch("/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        window.location.href = "/";
      }
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <>
      <button>
        <Logout />
      </button>
    </>
  );
}
