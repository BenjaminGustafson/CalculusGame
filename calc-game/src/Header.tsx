
import { Link } from "react-router-dom";
import './Header.css';

export function Header({ button }: { button?: React.ReactNode }) {
    return (
      <header className="header">
        <Link to="/">
        <h1 className="logo">
          <img src="./src/assets/shipSW.png"/>
        Fluxionum</h1>
        </Link>
        {button}
      </header>
    );
  }
  