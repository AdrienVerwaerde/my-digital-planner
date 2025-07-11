
import { useEffect, useState } from 'react'

export const useFooterVisible = () => {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const footerEl = document.getElementById('app-footer')
        if (!footerEl) return

        const observer = new IntersectionObserver(
            ([entry]) => setVisible(entry.isIntersecting),
            { root: null, threshold: 0.1 }
        )

        observer.observe(footerEl)
        return () => observer.disconnect()
    }, [])

    return visible
}
