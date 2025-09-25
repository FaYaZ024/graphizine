import React, { useEffect, useState, } from "react";
import { useParams, useNavigate } from "react-router-dom";

const CategoryPages = () => {
    const { categoryName } = useParams();
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetch(`http://localhost:8080/api/upload/${categoryName}`)
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => console.error("Error fetching category items:", err));
    }, [categoryName]);

    const handleProtectedDownload = async (url, name) => {
        if (!user) {
            navigate("/login");
            return;
        }
        // Blob download logic
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = name || "image.jpg";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(link.href);
        } catch (error) {
            console.error("Download failed:", error);
        }
    };


    return (
        <div >
            <h1 className="text-xl font-bold mb-6 mt-5 text-center">{categoryName} COLLECTION</h1>
            {items.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
                    {items.map((item) => (
                        <div
                            key={item._id}
                            className="bg-slate-500 rounded-xl p-4 shadow-lg flex flex-col items-center"
                        >
                            {item.imagePath && (
                                <img
                                    src={`http://localhost:8080/${item.imagePath}`}
                                    alt={item.name}
                                    className="w-lg h-80 object-cover rounded-lg mb-3"
                                />
                            )}
                            <span className="font-semibold text-slate-700 mb-3">
                                {item.name}
                            </span>

                            <div className="flex gap-2"><button
                                onClick={() => window.open(`http://localhost:8080/${item.imagePath}`, "_blank")}
                               className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition"
                            >
                                Preview
                            </button>

                                <button
                                    onClick={() => handleProtectedDownload(`http://localhost:8080/${item.imagePath}`, item.name || "image.jpg")}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                                >
                                    Download
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <p>No items found in this category.</p>
            )}
        </div>
    );
};

export default CategoryPages;

