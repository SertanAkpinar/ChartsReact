import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import seedrandom from 'seedrandom';
import 'chart.js/auto';

// Funktion zum Generieren von Farben
function generateColors(seed, numColors) {
  const rng = seedrandom(seed);
  const colors = [];
  for (let i = 0; i < numColors; i++) {
    const r = Math.floor(rng() * 255);
    const g = Math.floor(rng() * 255);
    const b = Math.floor(rng() * 255);
    colors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
  }
  return colors;
}

const PieChartWithStackedBar = () => {
  const [chartData, setChartData] = useState(null);
  const [selectedPostalCodes, setSelectedPostalCodes] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/data')
      .then(response => {
        const data = response.data;
        console.log('daten empfangen', data)
        const postalCodes = data.postalCodes;
        const total = data.total;
        const colors = generateColors(42, postalCodes.length);

        setChartData({
          labels: postalCodes,
          datasets: [
            {
              label: 'Gesamt',
              data: total,
              backgroundColor: colors,
              borderColor: colors.map(color => color.replace('0.6', '1')),
              borderWidth: 1,
            }
          ],
          categories: data.categories
        });
      })
      .catch(error => console.error('Fehler beim Abrufen der Daten:', error));
  }, []);

  const handlePieClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedPostalCode = chartData.labels[clickedIndex];

      setSelectedPostalCodes(prevSelected => {
        if (prevSelected.includes(clickedPostalCode)) {
          return prevSelected.filter(code => code !== clickedPostalCode);
        } else {
          return [...prevSelected, clickedPostalCode];
        }
      });
    }
  };

  const generateBarChartData = () => {
    if (!chartData || selectedPostalCodes.length === 0) return null;
    console.log(chartData.categories)
    const labels = selectedPostalCodes;
    console.log(labels)
    const categories = Object.keys(chartData.categories);

    const datasets = categories.map(category => ({
      label: category,
      data: selectedPostalCodes.map(postalCode => {
        const postalCodeIndex = chartData.labels.indexOf(postalCode);
        return chartData.categories[category][postalCodeIndex];
      }),
      backgroundColor: generateColors(category, 1)[0],
      borderColor: generateColors(category, 1)[0].replace('0.6', '1'),
      borderWidth: 1,
    }));

    return {
      labels,
      datasets,
    };
  };

  if (!chartData) {
    return <p>Lade Chart-Daten...</p>;
  }

  return (
    <div>
      <h2>Gesamtdaten der Postleitzahlen</h2>
      <Pie 
        data={chartData} 
        options={{
          onClick: (event, elements, chart) => {
            handlePieClick(event, chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true));
          },
        }}
      />

      {selectedPostalCodes.length > 0 && (
        <div>
          <h2>Kategoriedaten der ausgewählten Postleitzahlen</h2>
          <Bar
            data={generateBarChartData()}
            options={{
              plugins: {
                legend: {
                  display: true,
                },
              },
              scales: {
                x: {
                  stacked: true,
                },
                y: {
                  stacked: true,
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PieChartWithStackedBar;
