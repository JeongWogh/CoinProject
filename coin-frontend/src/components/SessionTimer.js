import React, { useState, useEffect } from 'react';
import './SessionTimer.css';

function SessionTimer() {
    const [timeLeft, setTimeLeft] = useState(30 * 60); // 30분을 초로 표현

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prevTime => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    // 세션 만료 처리
                    window.location.href = '/login';
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    return (
        <span className="session-timer">
            세션 시간: {formatTime(timeLeft)}
        </span>
    );
}

export default SessionTimer;