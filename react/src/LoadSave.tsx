import "./LoadSave.css";
import { Header } from "./Header";
import { Link } from "react-router-dom";



export function LoadSave() {
  return (
    <>
    <Header/>
    <div className="loadsave">
    <p>Choose how to save your progress.</p>
    <div className="slots">
        <div className="slot">
          <h3>Sign in with Google</h3>
          <p>Coming soon</p>
          {/* <button> Sign in </button> */}
        </div>
        <div className="slot">
          <h3>Slot 1</h3>
          <p>Saved to your browser's local storage.</p>
          <Link to="/map">
          <button> Load </button>
          </Link>
          <p>0/64 puzzles solved</p>
        </div>
        <div className="slot">
          <h3>Slot 2</h3>
            <p>Coming soon</p>
          </div>
        </div>
    </div>
    </>
  );
}
