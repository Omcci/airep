import { useEffect, useState } from 'react'
import { Sun, Moon } from 'lucide-react'

export default function ThemeToggle() {
    const [dark, setDark] = useState(true)
    useEffect(() => {
        const root = document.documentElement
        if (dark) root.classList.add('dark')
        else root.classList.remove('dark')
    }, [dark])
    return (
        <button
            aria-label="Toggle theme"
            className="inline-flex h-9 w-9 items-center justify-center rounded-md border bg-white text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
            onClick={() => setDark((v) => !v)}
        >
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </button>
    )
}


