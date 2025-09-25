import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./Context";

function Header() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
    const { user, setUser } = useContext(UserContext);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <>
      <h1 className="text-7xl text-center tracking-[2cm] mt-15">GRAPHIZINE</h1>
      <div className="flex justify-between items-center px-8 mt-7">
        {user ? (
          <>
            <span className="text-4xl color-change-solid font-extrabold tracking-widest">Welcome Folks🎉</span>
            <button
              onClick={handleLogout}
              className="cursor-pointer px-2.5 rounded bg-red-500 outline-solid outline-2 outline-red-700 hover:bg-red-700  hover:outline-red-500 "
            >
              Logout
            </button>
          </>
        ) : (
          <Link
            to="/login"
            className="cursor-pointer px-2.5 rounded bg-emerald-500 outline-solid outline-2 outline-emerald-700 hover:bg-emerald-700  hover:outline-emerald-500"
          >
            Log in
          </Link>
        )}
      </div>

      <nav>
        <div className="flex justify-around mt-7 bg-slate-900 h-13 p-3.5 underline text-blue-400">
          <Link to="/" className="hover:text-blue-500 transition-colors duration-200">Home</Link>
          {categories.map((cat) => (
            <Link key={cat._id} to={`/${cat.name.toLowerCase()}`} className="hover:text-blue-500 transition-colors duration-200">
              {cat.name}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

export default Header;

