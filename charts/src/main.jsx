import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import FußballerChart from './FußballerChart.jsx'
import './index.css'
import KreisChart from './kreisChart.jsx'
import BarChart from './BarChart.jsx'
import Maps from './maps.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Maps />
  </StrictMode>,
)
