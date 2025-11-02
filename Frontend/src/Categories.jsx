
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [newCategory, setNewCategory] = useState("");

    const fetchCategories = () => {
        fetch("https://graphizinebackend.onrender.com/api/categories")
            .then(res => res.json())
            .then(data => setCategories(data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const addCategory = () => {
        if (!newCategory.trim()) return;

        fetch("https://graphizinebackend.onrender.com/api/categories", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newCategory })
        })
            .then(res => res.json())
            .then(data => {
                if (data?.category) {
                    fetchCategories();
                } else if (data?.message) {
                    alert(data.message);
                }
                setNewCategory("");
            })
            .catch(err => console.error(err));
    };

    const removeCategory = (id) => {
        if (window.confirm("Are you sure you want to delete this category?")) {
            fetch(`https://graphizinebackend.onrender.com/api/categories/${id}`, {
                method: "DELETE",
            })
                .then(res => res.json())
                .then(() => fetchCategories())
                .catch(err => console.error(err));
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <div className="bg-white rounded-xl p-5 max-w-md mx-auto">
                <h2 className="text-2xl font-bold mb-5">Categories</h2>

                <ul>
                    {categories.map(cat => (
                        <li key={cat._id} className="mb-2 flex items-center">
                            <Link to={`/${cat.name}`} className="mr-3 text-blue-600 hover:underline">
                                {cat.name}
                            </Link>
                            <button
                                onClick={() => removeCategory(cat._id)}
                                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition cursor-pointer border-none"
                            >
                                Remove
                            </button>
                        </li>
                    ))}
                </ul>

                <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category"
                    className="w-full mt-6 p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
                <button onClick={addCategory} className="mt-3 w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition font-semibold">Add</button>
            </div>
            <Link
    to="/upload"
    className="mt-6 px-6 py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition"
  >
    UPLOAD
  </Link>
        </div>
        
    );
};

export default Categories;


