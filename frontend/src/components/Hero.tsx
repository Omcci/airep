import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'

export default function Hero() {
    return (
        <div className="relative overflow-hidden rounded-2xl border bg-gradient-to-b from-white/60 to-white/20 p-10 shadow-sm dark:from-gray-900/60 dark:to-gray-900/20">
            <motion.h1
                className="text-4xl font-extrabold tracking-tight sm:text-5xl"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
            >
                Next‑gen AI SEO
                <span className="bg-gradient-to-r from-indigo-600 via-sky-500 to-emerald-500 bg-clip-text text-transparent"> for LLMs</span>
            </motion.h1>
            <motion.p
                className="mt-3 max-w-2xl text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
            >
                Structure, specificity, accessibility, and authority to get quoted by conversational AI.
            </motion.p>
            <motion.div
                className="mt-6 flex gap-3"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, ease: 'easeOut', delay: 0.2 }}
            >
                <Button asChild>
                    <Link to="/audit">Run AI SEO Audit</Link>
                </Button>
                <Button asChild variant="secondary">
                    <Link to="/report">Read the Report</Link>
                </Button>
            </motion.div>
            <div className="pointer-events-none absolute -top-10 right-0 h-[220px] w-[220px] rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-10 left-0 h-[260px] w-[260px] rounded-full bg-emerald-500/20 blur-3xl" />
        </div>
    )
}


