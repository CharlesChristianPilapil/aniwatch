import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { resetLockout, startLockout, tick, rehydrateLockout } from "../slices/lockoutSlice";

type TimerLockoutType = {
    key: string;
    cooldownInSeconds?: number;
    initialValue?: number;
};

const useTimerLockout = ({
    key,
    cooldownInSeconds = 90,
    initialValue = 0
}: TimerLockoutType) => {

    const dispatch = useDispatch();
    const { timeLeft } = useSelector((state: RootState) => state.lockout);

    useEffect(() => {
        dispatch(rehydrateLockout({ key }));
    }, [dispatch, key]);

    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            dispatch(tick());
        }, 1000);

        return () => clearInterval(interval);
    }, [dispatch, timeLeft]);

    const reset = () => {
        if (timeLeft) return;
        dispatch(startLockout({ key, cooldownInSeconds }));
        dispatch(resetLockout());
    };

    const [initialTime, setInitialTime] = useState<number | undefined>(initialValue);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    
    const resetInitialCountdown = useCallback(() => {
        setInitialTime(initialValue);
    }, [initialValue]);
    
    useEffect(() => {
        if (!initialTime || initialTime <= 0) {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }
    
        if (!intervalRef.current) {
            intervalRef.current = setInterval(() => {
                setInitialTime(prev => {
                    if (prev && prev > 0) return prev - 1;
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                        intervalRef.current = null;
                    }
                    return 0;
                });
            }, 1000);
        }
    
        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        };
    }, [initialTime]);

    return {
        timeLeft: timeLeft > 0 ? timeLeft : (initialTime ?? 0),
        isLocked: timeLeft > 0 || (initialTime ?? 0) > 0,
        reset,
        initialTimer: initialTime,
        resetInitialCountdown
    };
};

export default useTimerLockout;