import { Routes, Route, Navigate } from 'react-router-dom'
import NavBar from './components/NavBar'
import SmoothScroll from './components/SmoothScroll'
import Home from './pages/Home'
import Report from './pages/Report'
import Checklist from './pages/Checklist'
import FAQ from './pages/FAQ'
import Glossary from './pages/Glossary'
import Audit from './pages/Audit'

function App() {
  return (
    <div>
      <div className="app-bg" />
      <NavBar />
      <SmoothScroll>
        <main className="mx-auto max-w-6xl p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/report" element={<Report />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/checklist" element={<Checklist />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </SmoothScroll>
    </div>
  )
}

export default App
