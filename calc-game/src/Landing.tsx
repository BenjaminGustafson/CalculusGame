import "./Landing.css";
import { Link } from "react-router-dom"; // if using react-router

export function Header() {
  return (
    <header className="header">
      <a href="/" className="logo">Fluxionum</a>
    </header>
  );
}

export function Landing() {
  return (
    <>
     <Header/>
      <section className="section hero">
        <div className="twoCol">
          <div className="graphic">
            <img src="./src/assets/shipSW.png" alt="Hero Graphic" className="graphic" />
        </div>
          <div className="text">
            <h1>A puzzle game that teaches calculus.</h1>
            <button>Get started</button>
          </div>
        </div>
      </section>

      <section className="section feature">
        <div className="twoCol">
          <div className="text">
            <h2>Learn by playing</h2>
            <p>Core mechanics based on actual math. No multiple choice questions, and no textbook-style reading.</p>
            <p>The game is a supplement, not a replacement, for traditional classroom teaching. </p>
          </div>
          <div className="graphic">
            <video src="./src/assets/quad3b.mp4" autoPlay loop muted playsInline className="graphic"/>
        </div>
        </div>
      </section>

      <section className="section feature">
        <div className="twoCol">
          <div className="graphic"></div>
          <div className="text">
            <h2>Visual and interactive</h2>
            <p>Feature description</p>
            <button>Learn more</button>
          </div>
        </div>
      </section>

      <section className="section feature">
        <div className="twoCol">
          <div className="text">
            <h2>Structured algebra</h2>
            <p></p>
          </div>
          <div className="graphic">Title</div>
        </div>
      </section>

      <section className="section end">
        <div className="twoCol">
          <div className="text">
            <h2>Work in progress</h2>
            <p>The game is still in developement. This is a project that I am working on in my free time.</p>
            <p>About 60 puzzles are currently playable.</p>
          </div>
        </div>
      </section>
    </>
  );
}
