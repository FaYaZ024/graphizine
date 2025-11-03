import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useContext, useRef } from "react";
import axios from "axios";
import { UserContext } from "./Context";


function Header() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const { user, setUser } = useContext(UserContext);
  const [selectedCategory, setSelectedCategory] = useState("home");
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const getCategoryLabel = (catName) => {
    if (catName === "home") return "Home";
    const cat = categories.find(c => c.name.toLowerCase() === catName);
    return cat ? cat.name : catName;
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpen(false);
    }
  };
  if (open) {
    document.addEventListener("mousedown", handleClickOutside);
  } else {
    document.removeEventListener("mousedown", handleClickOutside);
  }
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [open]);

  return (
    <>

      <div className="sticky top-0 z-50  flex justify-between items-center px-8 mt-7 w-full ">
        <div ref={dropdownRef} className="flex items-start px-4 py-2">
          <button
            className="border px-3 py-1 text-xs rounded-md  hover:bg-brown transition"
            onClick={() => setOpen(v => !v)}
            type="button"
          >
            {getCategoryLabel(selectedCategory) || "Choose Category"}
            <span className="ml-2">&#9662;</span> {/* down arrow */}
          </button>
          {open && (
            <div className="relative left-0 mt-1 min-w-28 rounded-md shadow z-10 border">
              <div
                onClick={() => {
                  setSelectedCategory("home");
                  setOpen(false);
                  navigate("/");
                }}
                className="px-4 py-1 cursor-pointer hover:bg-brown text-xs"
              >
                Home
              </div>
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  onClick={() => {
                    setSelectedCategory(cat.name.toLowerCase());
                    setOpen(false);
                    navigate(`/${cat.name.toLowerCase()}`);
                  }}
                  className="px-4 py-1 cursor-pointer hover:bg-brown text-xs"
                >
                  {cat.name}
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          {user ? (
            <>

              <button
                onClick={handleLogout}
                className="border border-beige rounded-md px-2 py-1 text-xs hover:bg-brown "
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="border border-beige rounded-md px-2 py-1 text-xs hover:bg-brown"
            >
              Log in
            </Link>
          )}
        </div>
      </div>

      <div className="flex justify-center items-center  ">
        <img src="/assets/op logo.svg" alt="logo" onClick={() => navigate("/")} className="w-22 h-22 mb-7  mr-2" />
        <h1 className="text-3xl text-center font-bold tracking-wider">GRAPHIZINE</h1>

      </div>

    </>
  );
}

export default Header;

