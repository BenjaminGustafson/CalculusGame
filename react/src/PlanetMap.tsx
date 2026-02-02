import { Header } from './Header'
import "./PlanetMap.css"; 

export function PlanetMap() {
    return (
        <>
        <Header />
        <div className="planetMap">
            <div className="planet">
                <h2 className="planetName">Linear</h2>
                <p>Learn how to take the derivative of <i>ax+b</i>, and how to fly a spaceship.</p>
                <div className='planetRow'>
                    <div className='planetButton'>
                        <a href='/play'>
                        <button> Learn</button>
                        </a>
                        <p>0/12 puzzles complete</p>
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
                <h2 className="planetName">Quadratic</h2>
                <p>Learn how to take the derivative of <i>x</i><sup>2</sup>, and about gravity.</p>
                <div className='planetRow'>
                    <div className='planetButton'>
                        <button> Learn</button>
                        <p>0/12 puzzles complete</p>
                    </div>
                    <img src="./src/assets/quadplanet.svg" alt="Linear Planet" className="planetGraphic"/>
                    <div className='planetButton'>
                        <button> Practice</button>
                        <p></p>
                    </div>
                </div>
            </div>

            <div className="planet">
                <h2 className="planetName">Power</h2>
                <div className='planetRow'>
                    <div className='planetButton'>
                        <button> Learn</button>
                        <p>0/12 puzzles complete</p>
                    </div>
                    <img src="./src/assets/quadplanet.svg" alt="Linear Planet" className="planetGraphic"/>
                    <div className='planetButton'>
                        <button> Practice</button>
                        <p></p>
                    </div>
                </div>
            </div>
        </div>
        </>
    );
}