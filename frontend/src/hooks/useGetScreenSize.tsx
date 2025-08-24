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
            const width = window.innerWidth;
            const height = window.innerHeight;

            setScreenSize({ width, height });
        };

        window.addEventListener('resize', handleResize);
        handleResize();
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return screenSize;
}

export default useGetScreenSize;