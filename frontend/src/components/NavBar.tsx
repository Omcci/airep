import { NavLink } from 'react-router-dom'

function NavBar() {
  const base = 'px-3 py-2 rounded-md text-sm font-medium'
  const active = 'bg-blue-600 text-white'
  const inactive = 'text-gray-700 hover:bg-gray-100'

  return (
    <nav className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          <NavLink to="/" className="text-lg font-semibold text-blue-700">
            SEO NG
          </NavLink>
          <div className="flex gap-1">
            <NavLink to="/report" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              Rapport
            </NavLink>
            <NavLink to="/checklist" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              Checklist
            </NavLink>
            <NavLink to="/faq" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              FAQ
            </NavLink>
            <NavLink to="/glossary" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              Glossaire
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar


