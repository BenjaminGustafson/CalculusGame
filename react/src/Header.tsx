import { Link } from "react-router-dom";
import './Header.css';
import shipSW from "./assets/shipSW.png";

export function Header({ button }: { button?: React.ReactNode }) {
    return (
      <header className="header">
        <Link to="/">
        <h1 className="logo">
          <img src={shipSW}/>
        Fluxionum</h1>
        </Link>
        {button}
      </header>
    );
  }
  