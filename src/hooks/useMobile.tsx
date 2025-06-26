import { useState, useEffect } from "react"

const breakpoint = 768 

const useMobile = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < breakpoint)
        }

        checkMobile()

        window.addEventListener("resize", checkMobile)

        return () => {
            window.removeEventListener("resize", checkMobile)
        }
    }, []) 

    return isMobile
}

export default useMobile
