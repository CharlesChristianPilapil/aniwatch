import { useEffect, useState } from "react";

type ScreenSize = {
    height: number;
    width: number;
}

const useGetScreenSize = (): ScreenSize => {
    const [screenSize, setScreenSize] = useState<ScreenSize>({
        width: window.innerWidth,
        height: window.innerHeight,
    });

    useEffect(() => {
        const handleResize = () => {
            setScreenSize({
                width: window.innerWidth,
                height: window.innerHeight,
            });
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenSize;
}

export default useGetScreenSize;