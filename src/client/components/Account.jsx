// import stuff
import Logout from "./Logout";

// the main page stuff
export default function Account() {
  const handleLogout = async () => {
    try {
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
