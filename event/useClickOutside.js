import { useEffect, useRef } from "react"

const useClickOutside = (
    onOutsideClick,
    isActive = false
) => {
    const ref = useRef(null);

    useEffect(() => {
        if (!isActive) return;
        const handleClick = event => {
            if (ref?.current && !ref.current.contains(event.target)) {
                onOutsideClick()
            }
        }

        document.addEventListener('mousedown', handleClick)
        return () => document.removeEventListener('mousedown', handleClick)
    }, [ref, onOutsideClick, isActive]);

    return ref;
}

export default useClickOutside;