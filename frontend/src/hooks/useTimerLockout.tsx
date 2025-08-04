import { useEffect, useState } from "react";

type TimerLockoutType = {
    key: string;
    cooldownInSeconds?: number;
    minimum?: number;
};

const useTimerLockout = ({
    key,
    cooldownInSeconds = 90,
    minimum = 0,
}: TimerLockoutType) => {
    const [timeLeft, setTimeLeft] = useState<number>(() => {
        const last = localStorage.getItem(key);
        if (last) {
            const diff = Math.floor((Date.now() - +last) / 1000);
            return Math.max(cooldownInSeconds - diff, minimum);
        }

        return minimum;
    });

    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [timeLeft]);

    const reset = () => {
        const now = Date.now();
        localStorage.setItem(key, now.toString());
        setTimeLeft(cooldownInSeconds);
    };

    return { timeLeft, reset };
};

export default useTimerLockout;
