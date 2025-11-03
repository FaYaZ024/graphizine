import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp,faDownload,  } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, Link } from "react-router-dom";

function Home() {


  const [latestImages, setLatestImages] = useState([]);
  const navigate = useNavigate();

  const [activeImgIdx, setActiveImgIdx] = useState(null);

  const [previewIdx, setPreviewIdx] = useState(null);
  const user = JSON.parse(localStorage.getItem("user"));

  const [allImages, setAllImages] = useState([]);
  useEffect(() => {
    axios.get("http://localhost:8080/api/images") // <-- your API should return all images
      .then(res => setAllImages(res.data))
      .catch(err => console.error("Error fetching all images:", err));
  }, []);

  // Sort allImages by createdAt descending (latest first)
  const sortedImages = [...allImages].sort((a, b) => {
    if (!a.createdAt || !b.createdAt) return 0;
    return new Date(b.createdAt) - new Date(a.createdAt);
  });



  useEffect(() => {
    axios.get("http://localhost:8080/api/images/latest")
      .then(res => setLatestImages(res.data))
      .catch(err => console.error("Error fetching latest images:", err));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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
    <div>
      <div className="bg-brown/60  w-full flex flex-row items-end justify-center space-x-8 py-10">
        <h2 className="text-xl font-bold tracking-wide flex-shrink-0 flex items-center justify-center pr-25 h-[350px]" >Latest upload</h2>
        {latestImages.map((img, idx) => (
          <div
            key={img._id}
            className={`relative transition-transform duration-300 cursor-pointer select-none`}
            style={{
              width: previewIdx === idx ? 550 : 20,
              height: 350,
              transform: previewIdx === idx
                ? `rotateY(0deg) scale(1.09)`
                : `rotateY(70deg) scale(0.98)`,
              boxShadow: previewIdx === idx
                ? "0 12px 50px 0 rgba(40,40,80,.23)"
                : "0 3px 18px 0 rgba(40,40,60,.12)",
              zIndex: previewIdx === idx ? 40 : 10,
              transition: "all .4s cubic-bezier(.86,0,.07,1)",
            }}
            onClick={() => setPreviewIdx(previewIdx === idx ? null : idx)}
          >
            <img
              src={`http://localhost:8080/${img.imagePath}`}
              alt={img.name}
              style={{
                width: "100%",
                height: "100%",
                objectFit: previewIdx === idx ? "cover" : "fill",
                borderRadius: 7,
                cursor: "pointer",
                pointerEvents: "none",
                userSelect: "none"
              }}
              draggable={false}
            />
            {/* Overlay Title/Label (optional, appears only when open) */}
            {previewIdx === idx && (
              <div className="absolute left-4 bottom-3 text-white text-xl font-bold drop-shadow-lg">
                {img.name}
              </div>
            )}
            {/* Close/Collapse Button when expanded */}
            {previewIdx === idx && (
              <button
                className="absolute top-2 right-2 bg-black/70 rounded-full w-7 h-7 text-white"
                onClick={e => { e.stopPropagation(); setPreviewIdx(null); }}
              >✖</button>
            )}
          </div>
        ))}
      </div>

      {/* dome part*/}
      <div className="min-h-screen flex flex-col items-center py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12 w-fit  justify-items-centerr">
          {sortedImages.map((img, idx) => (
            <div
              key={img._id}
              className="relative group transition-transform duration-300"
              style={{
                zIndex: activeImgIdx === idx ? 30 : 1,
              }}
            >
              <img
                src={`http://localhost:8080/${img.imagePath}`}
                alt={img.name}
                className={`aspect-square w-50 h-50 object-cover rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300
            ${activeImgIdx === idx ? "opacity-0 pointer-events-none" : ""}
          `}
                onClick={() => setActiveImgIdx(idx)}
              />
            </div>
          ))}
        </div>

        {/* Centered fullscreen modal */}
        {activeImgIdx !== null && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70" onClick={() => setActiveImgIdx(null)}>
            <div
              className="relative rounded-lg shadow-2xl flex flex-col items-center"
              style={{ width: "600px", height: "500px" }}
              onClick={e => e.stopPropagation()}
            >
              <button
                className="absolute top-3 right-2 bg-black/60 rounded-full w-7 h-7 text-white"
                onClick={() => setActiveImgIdx(null)}
              >✖</button>
              <img
                src={`http://localhost:8080/${sortedImages[activeImgIdx].imagePath}`}
                alt={sortedImages[activeImgIdx].name}
                className="object-contain w-full h-full rounded-lg"
              />
              <button
                onClick={() => handleProtectedDownload(`http://localhost:8080/${sortedImages[activeImgIdx].imagePath}`, sortedImages[activeImgIdx].name || "image.jpg")}
                className="mt-2 bg-black/70 text-white rounded-lg px-4 py-1 text-lg font-bold hover:bg-beige transition"
              >
               <FontAwesomeIcon icon={faDownload} />
              </button>
            </div>
          </div>
        )}
      </div>


      <div className="text-center m-7">
        <p>Don't dig too deep , you can go back up by clicking this button below. </p>
        <button
          onClick={scrollToTop}
          className="mt-4 p-3 border-beige border-2 rounded-full text-beige  hover:bg-brown transition"
          aria-label="Scroll to top"
        >
          <FontAwesomeIcon icon={faArrowUp} size="lg" />
        </button>
      </div>


    </div>
  );
}

export default Home;
