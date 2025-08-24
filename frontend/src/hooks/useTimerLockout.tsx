import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../store";
import { resetLockout, startLockout, tick } from "../slices/lockoutSlice";

type TimerLockoutType = {
    key: string;
    cooldownInSeconds?: number;
    minimum?: number;
};

const useTimerLockout = ({
    key,
    cooldownInSeconds = 90,
}: TimerLockoutType) => {

    const dispatch = useDispatch();
    const { timeLeft } = useSelector((state: RootState) => state.lockout);

    useEffect(() => {
        dispatch(startLockout({ key, cooldownInSeconds }));
    }, [dispatch, key, cooldownInSeconds])

    useEffect(() => {
        if (timeLeft <= 0) return;

        const interval = setInterval(() => {
            dispatch(tick());
        }, 1000);

        return () => clearInterval(interval);
    }, [dispatch, timeLeft]);

    const reset = () => {
        dispatch(resetLockout());
    };

    return {
        timeLeft,
        isLocked: timeLeft > 0,
        reset,
    };
};

export default useTimerLockout;