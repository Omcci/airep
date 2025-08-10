import { NavLink } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'

function NavBar() {
  const base = 'px-3 py-2 rounded-md text-sm font-medium transition-colors'
  const active = 'bg-blue-600 text-white shadow-sm'
  const inactive = 'text-gray-700 hover:bg-gray-100'

  return (
    <nav className="border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          <NavLink to="/" className="text-lg font-semibold text-blue-700">
            AI SEO
          </NavLink>
          <div className="flex items-center gap-2">
            <NavLink to="/audit" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              Audit
            </NavLink>
            <NavLink to="/report" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              Report
            </NavLink>
            <NavLink to="/checklist" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              Checklist
            </NavLink>
            <NavLink to="/faq" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              FAQ
            </NavLink>
            <NavLink to="/glossary" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              Glossary
            </NavLink>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar


