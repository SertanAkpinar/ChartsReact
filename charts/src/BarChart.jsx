import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import 'chart.js/auto';
import seedrandom from 'seedrandom';

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

const BarChartWithScroll = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/data')
      .then(response => {
        const data = response.data;

        const postalCodes = data.postalCodes;
        const categories = Object.keys(data.categories);

        // Entferne den "Gesamt"-Wert, falls vorhanden
        if (categories.includes("Gesamt")) {
          delete data.categories['Gesamt'];
        }

        // Farben generieren für jede Kategorie
        const colors = generateColors(42, categories.length);

        // Datensätze für das Barchart erstellen
        const datasets = categories.map((category, index) => ({
          label: category,
          data: data.categories[category],
          backgroundColor: colors[index],
          borderColor: colors[index].replace('0.6', '1'),
          borderWidth: 1,
        }));

        setChartData({
          labels: postalCodes,
          datasets,
        });
      })
      .catch(error => console.error('Fehler beim Abrufen der Daten:', error));
  }, []);

  if (!chartData) {
    return <p>Lade Chart-Daten...</p>;
  }

  return (
    <div style={{ width: '100%', height: '500px' }}>
      <h2>Kategoriedaten der Postleitzahlen</h2>
      <div style={{ 
          width: '800px', // Feste Breite des Chart-Containers
          height: '400px', // Feste Höhe des Chart-Containers
          overflow: 'auto'  // Scrollen innerhalb des Containers ermöglichen
        }}>
        <Bar
          data={chartData}
          options={{
            plugins: {
              legend: {
                display: true,
              },
            },
            scales: {
              x: {
                stacked: true,
                beginAtZero: true,
              },
              y: {
                stacked: true,
                beginAtZero: true,
              },
            },
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
};

export default BarChartWithScroll;
