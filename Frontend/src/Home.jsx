/*import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSquareCaretUp } from '@fortawesome/free-regular-svg-icons';
import { useNavigate } from 'react-router-dom';



function Home() {
         const navigate = useNavigate();
         
    return(
        <div>
            <h1>Freebies</h1>
            <nav>
                <div>
                   <Link to="/border">Borders</Link>
                   <Link to="/abstract">Abstract</Link>
                   <Link to="/illustration">Illustration</Link>
                </div>
            </nav>
            <p>Latest Items</p>
            <div>
                <h3>Borders</h3>
                <button type="button">All Borders</button>
            </div>
            <div>
                <h3>Abstracts</h3>
                <button type="button">All Abstracts</button>
            </div>
            <div>
                <h3>Illstrations</h3>
                <button type="button">All Illustrations</button>
            </div>

            <footer>
                <div>
                   
                </div>
                <div>
                     <p>Copyright © 2025 Freebies • All Rights Reserved | <Link to="/privacy">Privacy Policy</Link> | <Link to="/terms">Terms of Use</Link></p>
                    <FontAwesomeIcon
                        icon={faSquareCaretUp}
                        flip="horizontal"
                        onClick={() => navigate('/upload')}
                        style={{ fontSize: '30px', cursor: 'pointer' }}
                    />
                </div>
            </footer>
        </div>
    );
};

export default Home;



    import { Link, useNavigate } from "react-router-dom";
    import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
    import { faSquareCaretUp } from "@fortawesome/free-regular-svg-icons";
    import { useEffect, useState } from "react";
    import axios from "axios";

    function Home() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios
        .get("http://localhost:8080/api/categories")
        .then((res) => setCategories(res.data))
        .catch((err) => console.error("Error fetching categories:", err));
    }, []);

    return (
        <div>
        <h1>Freebies</h1>
        <div>
            <Link to="/login">Log in</Link>
        </div>
        <nav>
            <div>
            {categories.map((cat) => (
                <Link key={cat._id} to={`/${cat.name.toLowerCase()}`}>
                {cat.name}
                </Link>
            ))}
            </div>
        </nav>
            <p>Latest Items</p>
            <div>
                <h3>Borders</h3>
                <button type="button">All Borders</button>
            </div>
            <div>
                <h3>Abstracts</h3>
                <button type="button">All Abstracts</button>
            </div>
            <div>
                <h3>Illstrations</h3>
                <button type="button">All Illustrations</button>
            </div>

            <footer>
                <div>
                   
                </div>
                <div>
                     <p>Copyright © 2025 Freebies • All Rights Reserved | <Link to="/privacy">Privacy Policy</Link> | <Link to="/terms">Terms of Use</Link></p>
                    <FontAwesomeIcon
                        icon={faSquareCaretUp}
                        flip="horizontal"
                        onClick={() => navigate('/upload')}
                        style={{ fontSize: '30px', cursor: 'pointer' }}
                    />
                </div>
            </footer>
        </div>
    );
};

export default Home;*/



import { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from '@fortawesome/free-solid-svg-icons';

function Home() {

  const [latestImages, setLatestImages] = useState([]);

  useEffect(() => {
    // Fetch the latest 6 images
    axios.get("http://localhost:8080/api/images/latest")
      .then(res => setLatestImages(res.data))
      .catch(err => console.error("Error fetching latest images:", err));
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div>
      <div className="relative overflow-hidden w-full h-12 mt-6">
        <span className="marquee-right block font-bold absolute top-1/2 -translate-y-1/2 whitespace-nowrap text-3xl">
          LATEST UPLOADS
        </span>
      </div>
      <div className="mt-10 flex justify-center">
        <div className="grid grid-cols-2 gap-10 w-4/5 h-full">
          {latestImages.map(img => (
            <div key={img._id} className="w-lg h-full flex flex-col items-center mb-5">
              <img
                src={`http://localhost:8080/${img.imagePath}`}
                alt={img.name}
                className=" w-lg h-140 object-cover rounded-lg transition-transform duration-300 ease-in-out transform hover:scale-110"
              />
              <p className="mt-3 font-bold text-gray-900">{img.name}</p>
            </div>
          ))}

        </div>
      </div>
      <div className="text-center m-7">
        <p>Check Out the Collection : Browse our latest curated items by clicking this button </p>
         <button
          onClick={scrollToTop}
          className="mt-4 p-3 rounded-full bg-slate-700 text-white shadow-lg hover:bg-slate-800 transition"
          aria-label="Scroll to top"
        >
          <FontAwesomeIcon icon={faArrowUp} size="lg" />
          {/* or <FontAwesomeIcon icon={faChevronUp} size="lg" /> */}
        </button>
      </div>
    </div>
  );
}

export default Home;
