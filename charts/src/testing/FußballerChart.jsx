import React, { useEffect, useState } from 'react';
import { Pie, Bar } from 'react-chartjs-2';
import axios from 'axios';
import seedrandom from 'seedrandom';
import 'chart.js/auto';


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
  const [selectedPlayers, setSelectedPlayers] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:5000/data')
      .then(response => {
        const data = response.data;

        const spieler = data.Spieler;
        const insgesamt = data.Insgesamt;
        const year22 = data.Year22;
        const year23 = data.Year23;
        const year24 = data.Year24;

        const colors = generateColors(42, spieler.length);

        setChartData({
          labels: spieler,
          datasets: [
            {
              label: 'Insgesamt Tore',
              data: insgesamt,
              backgroundColor: colors,
              borderColor: colors.map(color => color.replace('0.6', '1')),
              borderWidth: 1,
            },
          ],
          year22,
          year23,
          year24
        });
      })
      .catch(error => console.error('Fehler beim Abrufen der Daten:', error));
  }, []);

  const handlePieClick = (event, elements) => {
    if (elements.length > 0) {
      const clickedIndex = elements[0].index;
      const clickedPlayer = chartData.labels[clickedIndex];

      setSelectedPlayers(prevSelected => {
        if (prevSelected.includes(clickedPlayer)) {
          return prevSelected.filter(player => player !== clickedPlayer);
        } else {
          return [...prevSelected, clickedPlayer];
        }
      });
    }
  };

  const generateBarChartData = () => {
    if (!chartData || selectedPlayers.length === 0) return null;

    const labels = selectedPlayers;

    const datasets = [
      {
        label: 'Year 2022',
        data: selectedPlayers.map(player => {
          const playerIndex = chartData.labels.indexOf(player);
          return chartData.year22[playerIndex];
        }),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1,
      },
      {
        label: 'Year 2023',
        data: selectedPlayers.map(player => {
          const playerIndex = chartData.labels.indexOf(player);
          return chartData.year23[playerIndex];
        }),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
      {
        label: 'Year 2024',
        data: selectedPlayers.map(player => {
          const playerIndex = chartData.labels.indexOf(player);
          return chartData.year24[playerIndex];
        }),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ];

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
      <h2>Gesamte Tore der Spieler</h2>
      <Pie 
        data={chartData} 
        options={{
          onClick: (event, elements, chart) => {
            handlePieClick(event, chart.getElementsAtEventForMode(event, 'nearest', { intersect: true }, true));
          },
        }}
      />

      {selectedPlayers.length > 0 && (
        <div>
          <h2>Jahresdaten der ausgewählten Spieler</h2>
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

