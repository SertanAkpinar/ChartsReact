import React, { useState } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import germanyGeoJson from './assets/bundeslaender.json';
import kreiseGeoJson from './assets/kreise.json';

const geoUrl = germanyGeoJson;
const kreiseUrl = kreiseGeoJson;

const GermanyMap = () => {
  const [selectedState, setSelectedState] = useState(null);

  const handleClick = (name) => {
    setSelectedState(name);
  };

  const handleReset = () => {
    setSelectedState(null);
  };

  const filteresGeographies = (geo) => {
    if (selectedState) {
      return geo.filter(geo => geo.properties.name === selectedState);
    }
    return geo;
  };

  const filteredKreise = (geo) => {
    if (selectedState) {
      return geo.filter(geo => geo.properties.NAME_1 === selectedState);
    }
    return [];
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
        {/* Wenn ein Bundesland ausgewählt ist */}
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
              <li 
                style={{ color: '#ffcccb', cursor: 'pointer' }} 
                onClick={() => handleClick("Baden-Württemberg")}
              >
                Baden-Württemberg
              </li>
              <li 
                style={{ color: '#add8e6', cursor: 'pointer' }} 
                onClick={() => handleClick("Bayern")}
              >
                Bayern
              </li>
              <li 
                style={{ color: '#90ee90', cursor: 'pointer' }} 
                onClick={() => handleClick("Berlin")}
              >
                Berlin
              </li>
              <li 
                style={{ color: '#ffa07a', cursor: 'pointer' }} 
                onClick={() => handleClick("Brandenburg")}
              >
                Brandenburg
              </li>
              <li 
                style={{ color: '#8a2be2', cursor: 'pointer' }} 
                onClick={() => handleClick("Bremen")}
              >
                Bremen
              </li>
              <li 
                style={{ color: '#f08080', cursor: 'pointer' }} 
                onClick={() => handleClick("Hamburg")}
              >
                Hamburg
              </li>
              <li 
                style={{ color: '#daa520', cursor: 'pointer' }} 
                onClick={() => handleClick("Hessen")}
              >
                Hessen
              </li>
              <li 
                style={{ color: '#20b2aa', cursor: 'pointer' }} 
                onClick={() => handleClick("Mecklenburg-Vorpommern")}
              >
                Mecklenburg-Vorpommern
              </li>
              <li 
                style={{ color: '#ff6347', cursor: 'pointer' }} 
                onClick={() => handleClick("Niedersachsen")}
              >
                Niedersachsen
              </li>
              <li 
                style={{ color: '#40e0d0', cursor: 'pointer' }} 
                onClick={() => handleClick("Nordrhein-Westfalen")}
              >
                Nordrhein-Westfalen
              </li>
              <li 
                style={{ color: '#ffeb3b', cursor: 'pointer' }} 
                onClick={() => handleClick("Rheinland-Pfalz")}
              >
                Rheinland-Pfalz
              </li>
              <li 
                style={{ color: '#8fbc8f', cursor: 'pointer' }} 
                onClick={() => handleClick("Saarland")}
              >
                Saarland
              </li>
              <li 
                style={{ color: '#ffb6c1', cursor: 'pointer' }} 
                onClick={() => handleClick("Sachsen")}
              >
                Sachsen
              </li>
              <li 
                style={{ color: '#87ceeb', cursor: 'pointer' }} 
                onClick={() => handleClick("Sachsen-Anhalt")}
              >
                Sachsen-Anhalt
              </li>
              <li 
                style={{ color: '#9370db', cursor: 'pointer' }} 
                onClick={() => handleClick("Schleswig-Holstein")}
              >
                Schleswig-Holstein
              </li>
              <li 
                style={{ color: '#cd5c5c', cursor: 'pointer' }} 
                onClick={() => handleClick("Thüringen")}
              >
                Thüringen
              </li>
            </ul>
          </div>
        )}
      </div>

      <div style={{ height: '100%', width: '800px' }}>
        <ComposableMap
          projectionConfig={{ scale: 2000, center: [10, 51], translate: [400, 300] }}
          projection='geoMercator'
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              filteresGeographies(geographies).map((geo) => {
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

          {selectedState && (
            <Geographies geography={kreiseUrl}>
              {({ geographies }) =>
                filteredKreise(geographies).map((geo) => {
                  const { name } = geo.properties;

                  return (
                    <Geography
                      key={geo.rsmkey}
                      geography={geo}
                      onClick={() => handleClick(name)}
                      style={{
                        default: { fill: '#D6D6DA', outline: 'none' },
                        hover: { fill: '#F53', outline: 'none' },
                        pressed: { fill: '#E42', outline: 'none' },
                      }}
                    />
                  );
                })
              }
            </Geographies>
          )}
        </ComposableMap>
      </div>
    </div>
  );
};

export default GermanyMap;
 