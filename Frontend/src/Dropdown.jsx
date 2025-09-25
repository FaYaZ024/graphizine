import { useState, useEffect } from "react";

function Dropdown({ onChange }) {
  const [selected, setSelected] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    // Fetch categories from backend API
    fetch("http://localhost:8080/api/categories") // change to your actual API endpoint
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error("Error fetching categories:", err));
  }, []);

  const handleChange = (event) => {
    const value = event.target.value;
    setSelected(value);
    onChange(value); // Notify parent
  };

  return (
    <div>
      <label htmlFor="dropdown">Choose a category:</label>
      <select id="dropdown" value={selected} onChange={handleChange} required className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-900">
        <option value="">-- Select --</option>
        {categories.map((category) => (
          <option key={category._id} value={category.name}>
            {category.name}
          </option>
        ))}
      </select>
      {selected && <p>You selected: {selected}</p>}
    </div>
  );
}

export default Dropdown;


