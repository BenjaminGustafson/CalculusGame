import { Header } from './Header'
import { Link } from "react-router-dom";
import "./PlanetMap.css"; 

export function PlanetMap() {
    return (
        <>
        <Header />
        <div className="planetMap">
            <div className="planet">
                <h2 className="planetName">Linear Planet</h2>
                <div className='planetRow'>
                    <div className='planetButton'>
                        <button> Learn</button>
                        <p>0/12 Puzzles complete</p>
                    </div>
                <img
                src="./src/assets/linearplanet.svg"
                alt="Linear Planet"
                className="planetGraphic"
                />
                <div className='planetButton'>
                        <button> Practice</button>
                        <p></p>
                    </div>
                </div>
            </div>

            <div className="planet">
                <h2 className="planetName">Quadratic Planet</h2>
                <img
                src="./src/assets/linearplanet.svg"
                alt="Linear Planet"
                className="planetGraphic"
                />
            </div>
        </div>
        </>
    );
}