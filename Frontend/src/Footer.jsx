import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { faSquareCaretUp } from "@fortawesome/free-regular-svg-icons";
import { Link, useNavigate } from "react-router-dom";

function Footer() {
  const navigate = useNavigate();

  return (
    <footer>
      <div className="bg-slate-700 text-center">
        <div className="text-center space-x-4 text-3xl mt-10">
          <FontAwesomeIcon icon={faInstagram} />
          <span>|</span>
          <FontAwesomeIcon icon={faLinkedin} />
          <span>|</span>
        </div>
        <p className="text-base/6 text-pretty md:text-balance m-7">
          Adding social media links ensures users can easily connect with our
          official platforms for updates and engagement. It strengthens brand
          presence, builds trust, and provides seamless access across channels.
        </p>
        <Link to="/terms">About Us</Link> <span>|</span>
        <Link to="/terms">Help Center</Link> <span>|</span>
        <Link to="/terms">Contact us</Link>
      </div>

      <div className="bg-slate-800 text-center h-7 text-xs tracking-wide">
        <p>
          Copyright © 2025 GRAPHIZINE • All Rights Reserved{" "}
          <FontAwesomeIcon
            icon={faSquareCaretUp}
            flip="horizontal"
            onClick={() => navigate("/upload")}
            className="text-lg cursor-pointer inline"
          />{" "}
          | <Link to="/privacy">Privacy Policy</Link> |{" "}
          <Link to="/terms">Terms of Use</Link>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
