
import React, { useEffect, useState, } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp,faDownload,  } from '@fortawesome/free-solid-svg-icons';

const CategoryPages = () => {
    const { categoryName } = useParams();
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [activeImgIdx, setActiveImgIdx] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:8080/api/upload/${categoryName}`)
            .then(res => res.json())
            .then(data => setItems(data))
            .catch(err => console.error("Error fetching category items:", err));
    }, [categoryName]);

    const handleProtectedDownload = async (url, name) => {
        if (!user) {
            console.log("No user, navigating to login...");
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
                <div className="min-h-screen flex flex-col items-center py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 w-fit justify-items-center">
                        {items.map((item, idx) => (
                            <div
                                key={item._id}
                                className="relative group transition-transform duration-300"
                                style={{
                                    zIndex: activeImgIdx === idx ? 30 : 1,
                                }}
                            >
                                {item.imagePath && (
                                    <img
                                        src={`http://localhost:8080/${item.imagePath}`}
                                        alt={item.name}
                                        className={`aspect-square w-56 h-56 object-cover rounded-lg shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300 ${activeImgIdx === idx ? "opacity-0 pointer-events-none" : ""
                                            }`}
                                        onClick={() => setActiveImgIdx(idx)}
                                    />
                                )}
                                <span className="font-semibold text-slate-700 mb-3 block text-center">
                                    {item.name}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Centered fullscreen modal for preview */}
                    {activeImgIdx !== null && (
                        <div
                            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
                            onClick={() => setActiveImgIdx(null)}
                        >
                            <div
                                className="relative rounded-lg shadow-2xl flex flex-col items-center bg-transparent"
                                style={{ width: "600px", height: "500px" }}
                                onClick={e => e.stopPropagation()}
                            >
                                <button
                                    className="absolute top-3 right-2 bg-black/60 rounded-full w-7 h-7 text-white"
                                    onClick={() => setActiveImgIdx(null)}
                                >✖</button>
                                <img
                                    src={`http://localhost:8080/${items[activeImgIdx].imagePath}`}
                                    alt={items[activeImgIdx].name}
                                    className="object-contain w-full h-full rounded-lg"
                                />
                                <button
                                    onClick={() => handleProtectedDownload(`http://localhost:8080/${items[activeImgIdx].imagePath}`, items[activeImgIdx].name || "image.jpg")}
                                    className="mt-2 bg-black/70 text-white rounded-lg px-4 py-1 text-lg font-bold hover:bg-beige transition"
                                >
                                   <FontAwesomeIcon icon={faDownload} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center text-gray-500">No items found.</div>
            )}
        </div>
    );
};

export default CategoryPages;

