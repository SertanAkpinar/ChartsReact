import React, { useState } from "react";
import {
  PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend
} from "recharts";

const data = [
  { name: 'Mercedes', models: 400, details: { sKlasse: 150, cKlasse: 75, gKlasse: 25, vKlasse: 50, aKlasse: 100 }},
  { name: 'BMW', models: 700, details: { einser: 400, vierer: 200, siebener: 100 }},
  { name: 'Volvo', models: 200, details: { xc60: 100, xc90: 50, xc40: 50 }},
  { name: 'VW', models: 1000, details: { golf: 500, polo: 300, tiguan: 100, tuareq: 100 }},
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF4567", "#32CD32", "#FFD700"];

const CarCharts = () => {
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Event-Handler, wenn ein Pie-Segment geklickt wird
  const onPieClick = (brand) => {
    setSelectedBrands((prevBrands) =>
      prevBrands.find((b) => b.name === brand.name)
        ? prevBrands.filter((b) => b.name !== brand.name)
        : [...prevBrands, brand]
    );
  };

  // Dynamisch alle Fahrzeugklassen (Details) aus den ausgewählten Marken extrahieren
  const allKeys = [...new Set(selectedBrands.flatMap(brand => Object.keys(brand.details)))];

  // Formatierung der Daten für den Stacked Bar Chart
  const chartData = selectedBrands.map((brand) => ({
    name: brand.name, 
    ...brand.details, 
  }));

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <div>
        <h3>Pie Chart (Total Models)</h3>
        <PieChart width={400} height={400}>
          <Pie
            data={data}
            dataKey="models"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={150}
            fill="#8884d8"
            label
            onClick={onPieClick}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>

      {selectedBrands.length > 0 && (
        <div style={{ marginLeft: 50 }}>
          <h3>Selected Brands Details (Stacked)</h3>
          <BarChart width={400} height={300} data={chartData} barSize={40}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {/* Dynamisch die Bars für alle gefundenen Fahrzeugklassen (Details) erstellen */}
            {allKeys.map((key, index) => (
              <Bar key={key} dataKey={key} stackId="a" fill={COLORS[index % COLORS.length]} />
            ))}
          </BarChart>
        </div>
      )}
    </div>
  );
};

export default CarCharts;

