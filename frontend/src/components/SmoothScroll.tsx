import { PropsWithChildren, useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScroll({ children }: PropsWithChildren) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.1,
            smoothWheel: true,
            smoothTouch: false,
            gestureOrientation: 'vertical',
        })

        function raf(time: number) {
            lenis.raf(time)
            requestAnimationFrame(raf)
        }
        const id = requestAnimationFrame(raf)

        return () => {
            cancelAnimationFrame(id)
            // @ts-expect-error destroy may be optional
            lenis?.destroy?.()
        }
    }, [])

    return <div>{children}</div>
}


