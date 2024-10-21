/*import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import kreiseGeoJson from './assets/kreise.json';
import { useParams, useNavigate } from 'react-router-dom';

const KreiseMap = () => {
  const { bundesland } = useParams();
  const [selectedState, setSelectedState] = useState(bundesland);
  const navigate = useNavigate();
  
  useEffect(() => {
    setSelectedState(bundesland);
  }, [bundesland]);

  const handleReset = () => {
    setSelectedState(null);
    navigate('/bundeslaender');
  };

  const filteredKreise = (geo) => {
    if (selectedState) {
      return geo.filter(geo => geo.properties.NAME_1 === selectedState);
    }
    return geo;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ width: '200px', marginBottom: '20px' }}>
        {selectedState && (
          <div>
            <h3>{selectedState}</h3>
            <button onClick={handleReset}>Zurück zur gesamten Karte</button>
          </div>
        )}
      </div>

      <div style={{ height: '100%', width: '800px' }}>
        <ComposableMap
          projectionConfig={{ scale: 4000, center: [10, 51], translate: [400, 300] }}
          projection='geoMercator'
        >
          <Geographies geography={kreiseGeoJson}>
            {({ geographies }) =>
              filteredKreise(geographies).map((geo) => {
                const { name } = geo.properties;

                return (
                  <Geography
                    key={geo.rsmkey}
                    geography={geo}
                    style={{
                      default: { fill: '#D6D6DA', outline: 'none', strokeWidth: 2 },
                      hover: { fill: '#F53', outline: 'none', strokeWidth: 2 },
                      pressed: { fill: '#E42', outline: 'none', strokeWidth: 2 },
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

export default KreiseMap;
*/

import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import kreiseGeoJson from './assets/kreise.json';
import { geoBounds, geoCentroid } from "d3-geo";  // Import d3-geo functions
import { useParams, useNavigate } from 'react-router-dom';

const KreiseMap = () => {
  const { bundesland } = useParams();  // Fetch the selected state from the URL params
  const [selectedState, setSelectedState] = useState(bundesland);
  const [mapConfig, setMapConfig] = useState({ center: [10, 51], scale: 4000 }); // Default projection settings
  const navigate = useNavigate();
  
  useEffect(() => {
    setSelectedState(bundesland);
    updateMapConfigForState(bundesland); // Update map configuration for the selected state
  }, [bundesland]);

  // Function to dynamically calculate center and scale for the selected state (bounding box)
  const updateMapConfigForState = (stateName) => {
    const stateGeo = kreiseGeoJson.features.find(geo => geo.properties.NAME_1 === stateName);

    if (stateGeo) {
      const bounds = geoBounds(stateGeo);  // Get bounding box of the state
      const centroid = geoCentroid(stateGeo);  // Get geographic center of the state
      const scale = calculateScale(bounds);  // Calculate scale based on bounding box size

      // Update map config with calculated values
      setMapConfig({
        center: centroid,
        scale: scale
      });
    }
  };

  // Function to calculate scale based on the bounding box of the selected district/state
  const calculateScale = (bounds) => {
    const [[x0, y0], [x1, y1]] = bounds;
    const width = x1 - x0;
    const height = y1 - y0;

    // Logic to return an appropriate scale based on the size of the bounding box
    const area = width * height;
    if (area < 0.1) return 10000;  // Zoom more for smaller areas
    if (area < 1) return 6000;
    if (area < 5) return 5000;
    return 4000;  // Default for larger areas
  };

  const handleReset = () => {
    setSelectedState(null);
    setMapConfig({ center: [10, 51], scale: 4000 }); // Reset to default projection
    navigate('/bundeslaender');  // Navigate back to the state map
  };

  const filteredKreise = (geo) => {
    if (selectedState) {
      return geo.filter(geo => geo.properties.NAME_1 === selectedState);
    }
    return geo;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <div style={{ width: '200px', marginBottom: '20px' }}>
        {selectedState && (
          <div>
            <h3>{selectedState}</h3>
            <button onClick={handleReset}>Zurück zur gesamten Karte</button>
          </div>
        )}
      </div>

      <div style={{ height: '100%', width: '800px' }}>
        <ComposableMap
          projectionConfig={{ scale: mapConfig.scale, center: mapConfig.center }}
          projection='geoMercator'
        >
          <Geographies geography={kreiseGeoJson}>
            {({ geographies }) =>
              filteredKreise(geographies).map((geo) => {
                const { name } = geo.properties;

                return (
                  <Geography
                    key={geo.rsmkey}
                    geography={geo}
                    style={{
                      default: { fill: '#D6D6DA', outline: 'none', strokeWidth: 2 },
                      hover: { fill: '#F53', outline: 'none', strokeWidth: 2 },
                      pressed: { fill: '#E42', outline: 'none', strokeWidth: 2 },
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

export default KreiseMap;
