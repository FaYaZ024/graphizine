
import { useState, useEffect } from "react";
import axios from "axios";
import Dropdown from "./Dropdown";
import { Link } from "react-router-dom";

function Upload({ onUploadSuccess }) {
    const [name, setName] = useState('');
    const [image, setImage] = useState(null);
    const [category, setCategory] = useState('');
    const [images, setImages] = useState([]);

    const handleSuccess = onUploadSuccess || (() => { });

    const fetchImages = async () => {
        try {
            const res = await axios.get("https://graphizinebackend.onrender.com/api/images");
            setImages(res.data);
        } catch (error) {
            console.error("Error fetching images:", error);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!category) {
            alert("Please select a category.");
            return;
        }

        const formData = new FormData();
        formData.append('name', name);
        formData.append('image', image);
        formData.append('category', category);

        const token = localStorage.getItem("adminToken");

        try {
            await axios.post(
                "https://graphizinebackend.onrender.com/api/upload",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            handleSuccess();
            setName('');
            setImage(null);
            setCategory('');
            e.target.reset();
        } catch (error) {
            console.error("Error uploading image:", error);
            alert("Failed to upload image!");
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this image?")) {
            try {
                const token = localStorage.getItem("adminToken");
                await axios.delete(
                    `https://graphizinebackend.onrender.com/api/images/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                fetchImages();
            } catch (error) {
                console.error("Error deleting image:", error);
                alert("Failed to delete image");
            }
        }
    };

    return (
        <div className="flex flex-col items-center mt-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-5 bg-white bg-opacity-90 rounded-xl shadow-lg p-8 w-full max-w-sm">
                <input
                    type="text"
                    placeholder="Enter name"
                    onChange={e => setName(e.target.value)}
                    required
                    className="px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none text-gray-900"
                />
                <input
                    type="file"
                    onChange={e => setImage(e.target.files[0])}
                    required
                    className="rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 focus:outline-none bg-white  text-gray-900"
                />
                <Dropdown value={category} onChange={setCategory} />
                <button type="submit" className="mt-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">Upload</button>
            </form>
            <Link to="/categories" className="mt-6 px-4 py-2 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition">ADD CATEGORY</Link>
            <table className="w-full border-collapse border border-black mt-20 text-center">
                <thead>
                    <tr>
                        <th className="border border-black px-4 py-2">Image Name</th>
                        <th className="border border-black px-4 py-2">Category</th>
                        <th className="border border-black px-4 py-2">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {images.map(img => (
                        <tr key={img._id} className="border border-black">
                            <td className="border border-black px-4 py-2">{img.name}</td>
                            <td className="border border-black px-4 py-2">{img.category}</td>
                            <td className="border border-black px-4 py-2">
                                <button
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                                    onClick={() => handleDelete(img._id)}
                                >Delete</button>
                            </td>
                        </tr>
                    ))}
                    {images.length === 0 && (
                        <tr><td colSpan="3" className="py-4">No images found.</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default Upload;




