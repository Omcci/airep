import { PropsWithChildren } from 'react'
import { motion } from 'framer-motion'

type Props = PropsWithChildren<{
    delay?: number
}>

export default function Reveal({ children, delay = 0 }: Props) {
    return (
        <motion.div
            initial={{ y: 24, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay }}
        >
            {children}
        </motion.div>
    )
}


