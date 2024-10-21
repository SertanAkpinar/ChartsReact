import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import germanyGeoJson from './assets/bundeslaender.json';
import { useNavigate } from 'react-router-dom';

const BundeslaenderMap = () => {
  const [selectedState, setSelectedState] = useState(null);
  const navigate = useNavigate();

  // Define center coordinates for each state
  const stateCenters = {
    "Baden-Württemberg": [9, 48.5],
    "Bayern": [11.5, 48.8],
    "Berlin": [13.4, 52.5],
    "Brandenburg": [13.2, 52.4],
    "Bremen": [8.8, 53.1],
    "Hamburg": [10, 53.55],
    "Hessen": [9, 50.6],
    "Mecklenburg-Vorpommern": [12.6, 53.6],
    "Niedersachsen": [9.8, 52.6],
    "Nordrhein-Westfalen": [7.5, 51.5],
    "Rheinland-Pfalz": [7, 50],
    "Saarland": [6.9, 49.4],
    "Sachsen": [13.5, 51],
    "Sachsen-Anhalt": [11.6, 51.9],
    "Schleswig-Holstein": [9.6, 54.2],
    "Thüringen": [11, 50.8],
  };

  // Get the center and scale dynamically based on the selected state
  const mapCenter = selectedState ? stateCenters[selectedState] : [10, 51]; // default center for Germany
  const mapScale = selectedState ? 3500 : 2000; // Adjust zoom level when state is selected

  const handleClick = (name) => {
    setSelectedState(name);
    navigate(`/kreise/${name}`);
  };

  const handleReset = () => {
    setSelectedState(null);
  };

  const filteredGeographies = (geo) => {
    if (selectedState) {
      return geo.filter(geo => geo.properties.name === selectedState);
    }
    return geo;
  };

  const getFillColor = (name) => {
    const colors = {
      "Baden-Württemberg": '#ffcccb',
      "Bayern": '#add8e6',
      "Berlin": '#90ee90',
      "Brandenburg": '#ffa07a',
      "Bremen": '#8a2be2',
      "Hamburg": '#f08080',
      "Hessen": '#daa520',
      "Mecklenburg-Vorpommern": '#20b2aa',
      "Niedersachsen": '#ff6347',
      "Nordrhein-Westfalen": '#40e0d0',
      "Rheinland-Pfalz": '#ffeb3b',
      "Saarland": '#8fbc8f',
      "Sachsen": '#ffb6c1',
      "Sachsen-Anhalt": '#87ceeb',
      "Schleswig-Holstein": '#9370db',
      "Thüringen": '#cd5c5c',
    };
    return colors[name] || '#D6D6DA';
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '200px', marginRight: '20px' }}>
        {selectedState && (
          <div>
            <h3>{selectedState}</h3>
            <button onClick={handleReset}>Zurück zur gesamten Karte</button>
          </div>
        )}

        {!selectedState && (
          <div>
            <h3>Legende:</h3>
            <ul>
              {Object.keys(stateCenters).map((state) => (
                <li 
                  key={state}
                  style={{ color: getFillColor(state), cursor: 'pointer' }} 
                  onClick={() => handleClick(state)}
                >
                  {state}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div style={{ height: '100%', width: '800px' }}>
        <ComposableMap
          projectionConfig={{ scale: mapScale, center: mapCenter }}
          projection='geoMercator'
        >
          <Geographies geography={germanyGeoJson}>
            {({ geographies }) =>
              filteredGeographies(geographies).map((geo) => {
                const { name } = geo.properties;

                return (
                  <Geography
                    key={geo.rsmkey}
                    geography={geo}
                    onClick={() => handleClick(name)}
                    style={{
                      default: { fill: getFillColor(name), outline: 'none' },
                      hover: { fill: '#F53', outline: 'none' },
                      pressed: { fill: '#E42', outline: 'none' },
                    }}
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
      </div>
    </div>
  );
};

export default BundeslaenderMap;
