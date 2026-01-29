import "./Landing.css";
import { Link } from "react-router-dom"; // if using react-router

export function Header() {
  return (
    <header className="header">
      <a href="/" className="logo">MySite</a>
    </header>
  );
}

export function Landing() {
  return (
    <>
      <section className="section hero">
        <div className="twoCol">
          <div className="graphic">
            <img src="./src/assets/shipSW.png" alt="Hero Graphic" className="graphic" />
        </div>
          <div className="text">
            <h1>A puzzle game that teaches calculus.</h1>
            <p>Some text</p>
            <button>Get started</button>
          </div>
        </div>
      </section>

      <section className="section feature">
        <div className="twoCol">
          <div className="graphic">Feature graphic</div>
          <div className="text">
            <h2>Feature title</h2>
            <p>Feature description</p>
            <button>Learn more</button>
          </div>
        </div>
      </section>
    </>
  );
}
