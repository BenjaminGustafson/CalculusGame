
import { Link } from "react-router-dom";


export function Header({ button }: { button?: React.ReactNode }) {
    return (
      <header className="header">
        <Link to="/">
        <h1 className="logo">Fluxionum</h1>
        </Link>
        {button}
      </header>
    );
  }
  