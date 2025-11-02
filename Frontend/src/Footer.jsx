import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faSquareCaretUp } from "@fortawesome/free-regular-svg-icons";
import { Link, useNavigate } from "react-router-dom";


function Footer() {
  const navigate = useNavigate();

  return (
    <footer>
      <div className=" text-center">
        <hr className=" bg-beige" />
        {/* <div className="text-center space-x-4 text-3xl mt-5">
          <FontAwesomeIcon icon={faInstagram} />
          <span>|</span>
          <FontAwesomeIcon icon={faLinkedin} />
          <span>|</span>
        </div> */}
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12 mt-5">
          {/* Left: Branding and description */}
          <div>
            <div className="text-3xl font-bold mb-4">GraphiZine</div>
            <p className="text-base/relaxed mb-2 tracking-normal font-medium">
              This website is a curated collection of creative images and assets available under a variety of free and paid licenses somewhere on the interwebs.
            </p>
          </div>

          {/* Center: Navigation */}
          <div>
            <div className="mb-2 font-semibold text-beige">Explore</div>
            <ul className="space-y-1">
              <li><Link to="/About" className="hover:underline">About Us</Link></li>
              <li><Link to="/Contact" className="hover:underline">Contact</Link></li>
              <li><Link to="/Privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/Terms" className="hover:underline">Terms of Use</Link></li>
            </ul>
          </div>

          {/* Right: Attribution/Meta/info */}
          <div>
            <div className="mb-2 font-semibold text-beige">Credits</div>
            <div className="mb-1">Website by <a href="https://yourprofile.com" className="hover:underline">FAYAZ-AHAMED</a></div>
            <div className="mb-1">Set in <span className="font-semibold">lemonmilk</span></div>
            <div className="mb-1">Backgrounds: Custom Blend</div>
            <div className="mb-2"><Link to="/contact" className="hover:underline">Contact</Link></div>
          </div>
        </div>
        <div className="text-center text-xs tracking-wide mt-10 text-beige">
          © {new Date().getFullYear()} Graphizine <FontAwesomeIcon
            icon={faSquareCaretUp}
            flip="horizontal"
            onClick={() => navigate("/upload")}
            className="text-lg cursor-pointer inline"
          />{" "} • All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
