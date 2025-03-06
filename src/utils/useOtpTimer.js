import { useState, useEffect } from "react";

const useOtpTimer = (initialTime) => {
    const [timer, setTimer] = useState(initialTime);

    useEffect(() => {
        if (timer <= 0) return; // Stop when the timer reaches 0

        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    return timer;
};

export default useOtpTimer;