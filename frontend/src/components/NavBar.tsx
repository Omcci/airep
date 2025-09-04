import { NavLink, useLocation } from 'react-router-dom'
import ThemeToggle from './ThemeToggle'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

function NavBar() {
  const base = 'relative px-3 py-2 rounded-md text-sm font-medium transition-colors'
  const active = 'text-foreground'
  const inactive = 'text-gray-700 hover:bg-muted/60 dark:text-gray-300'
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/70 backdrop-blur supports-[backdrop-filter]:bg-background/50">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-14 items-center justify-between">
          <NavLink to="/" className="flex items-center gap-2 text-lg font-semibold">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-gradient-to-br from-indigo-500 to-emerald-500 text-white shadow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent">
              AI SEO
            </span>
          </NavLink>
          <div className="flex items-center gap-2">
            <NavLink to="/studio" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              AI SEO Studio
              {location.pathname === '/studio' && (
                <motion.span layoutId="nav-underline" className="absolute inset-x-1 -bottom-1 h-0.5 rounded bg-gradient-to-r from-indigo-500 to-emerald-500" />
              )}
            </NavLink>
            <NavLink to="/studio/geo" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              GEO Studio
              {location.pathname === '/studio/geo' && (
                <motion.span layoutId="nav-underline" className="absolute inset-x-1 -bottom-1 h-0.5 rounded bg-gradient-to-r from-indigo-500 to-emerald-500" />
              )}
            </NavLink>
            <NavLink to="/report" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              Report
              {location.pathname === '/report' && (
                <motion.span layoutId="nav-underline" className="absolute inset-x-1 -bottom-1 h-0.5 rounded bg-gradient-to-r from-indigo-500 to-emerald-500" />
              )}
            </NavLink>
            <NavLink to="/checklist" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              Checklist
              {location.pathname === '/checklist' && (
                <motion.span layoutId="nav-underline" className="absolute inset-x-1 -bottom-1 h-0.5 rounded bg-gradient-to-r from-indigo-500 to-emerald-500" />
              )}
            </NavLink>
            <NavLink to="/faq" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              FAQ
              {location.pathname === '/faq' && (
                <motion.span layoutId="nav-underline" className="absolute inset-x-1 -bottom-1 h-0.5 rounded bg-gradient-to-r from-indigo-500 to-emerald-500" />
              )}
            </NavLink>
            <NavLink to="/glossary" className={({ isActive }) => `${base} ${isActive ? active : inactive}`}>
              Glossary
              {location.pathname === '/glossary' && (
                <motion.span layoutId="nav-underline" className="absolute inset-x-1 -bottom-1 h-0.5 rounded bg-gradient-to-r from-indigo-500 to-emerald-500" />
              )}
            </NavLink>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}

export default NavBar