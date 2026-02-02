import "./Landing.css";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Header } from "./Header";

import shipSW from './assets/shipSW.png';


function PlayButton({ refProp }: { refProp: React.Ref<HTMLButtonElement> }) {
  return <Link to="/loadsave"><button ref={refProp}>Play now</button></Link>;
}


export function Landing() {
  const playButtonRef = useRef<HTMLButtonElement>(null);
  const [inHeader, setInHeader] = useState(false);

  useEffect(() => {
    const top = playButtonRef.current!.offsetTop;
    const onScroll = () => setInHeader(window.scrollY > top);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <Header button={inHeader ? <PlayButton refProp={playButtonRef} /> : null} />
     

      <section className="section hero">
        <div className="twoCol">
          <div className="graphic">
            <img
              src={shipSW}
              alt="Hero Graphic"
              className="graphic"
            />
          </div>
          <div className="text">
            <h1>A puzzle game that teaches calculus.</h1>
            <p>Completely free. Runs in the browser.</p>
            {!inHeader && <PlayButton refProp={playButtonRef} />}
          </div>
        </div>
      </section>

      <section className="section feature">
        <div className="twoCol">
          <div className="text">
            <h2>Learn by playing</h2>
            <p>The game builds intuition for calculus with visual and interactive puzzles.
            </p>
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
            <h2>Practice and master the derivative</h2>
            <p>A block-based system simplifies algebra.</p>
          </div>
        </div>
      </section>

      <section className="section feature">
        <div className="twoCol">
          <div className="text">
            <h2>Video solutions when you get stuck</h2>
            <p></p>
          </div>
          <div className="graphic">Title</div>
        </div>
      </section>

      <section className="section darkblue">
        <div className="oneCol">
          <div className="text">
            <h2>Work in progress</h2>
            <p>The game is still in developement. This is a project that I am working on in my free time.</p>
            <p>About 60 puzzles are currently playable. I am working on creating short solution videos for each level.</p>
          </div>
        </div>
      </section>

      <section className="section end">
        <div className="oneCol">
          <div className="text">
            <h2>Contact</h2>
            <p>Have any feedback? Let me know: bengusgamedev@gmail.com</p>
          </div>
        </div>
      </section>

    </>
  );
}
