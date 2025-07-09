import React, { useState, useEffect, useCallback } from 'react';

const RedGreenLight = () => {
    const [gameState, setGameState] = useState('ready'); // ready, playing, won, lost
    const [octopusPosition, setOctopusPosition] = useState(5); // позиция в процентах
    const [lightState, setLightState] = useState('green'); // green, red, turning
    const [dollFacing, setDollFacing] = useState('right'); // right (смотрит на игрока), left (отвернулась)
    const [timeLeft, setTimeLeft] = useState(45);
    const [isMoving, setIsMoving] = useState(false);
    const [keysPressed, setKeysPressed] = useState(new Set());
    const [turningTimer, setTurningTimer] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [nextTurnTime, setNextTurnTime] = useState(0);

    const FINISH_LINE = 85; // позиция финиша
    const OCTOPUS_SPEED = 0.5; // скорость движения осьминога

    // Сброс игры
    const resetGame = () => {
        setGameState('ready');
        setOctopusPosition(5);
        setLightState('green');
        setDollFacing('left');
        setTimeLeft(45);
        setIsMoving(false);
        setKeysPressed(new Set());
        setTurningTimer(0);
        setNextTurnTime(0);
    };

    // Запуск игры
    const startGame = () => {
        setGameState('playing');
        setTimeLeft(45);
        setOctopusPosition(5);
        setLightState('green');
        setDollFacing('left');
        setNextTurnTime(Math.random() * 3000 + 2000); // 2-5 секунд до первого поворота
    };

    // Таймер игры
    useEffect(() => {
        let interval;
        if (gameState === 'playing' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameState('lost');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState, timeLeft]);

    // Логика поворотов куклы
    useEffect(() => {
        let turnInterval;

        if (gameState === 'playing') {
            turnInterval = setInterval(() => {
                setTurningTimer(prev => {
                    const newTimer = prev + 100;

                    if (lightState === 'green' && newTimer >= nextTurnTime) {
                        // Начинаем поворот
                        setLightState('turning');
                        setTurningTimer(0);
                        return 0;
                    }

                    if (lightState === 'turning' && newTimer >= 1000) {
                        // Заканчиваем поворот
                        setLightState('red');
                        setDollFacing('right');
                        setTurningTimer(0);
                        // Следующий поворот через 2-4 секунды
                        setNextTurnTime(Math.random() * 2000 + 2000);
                        return 0;
                    }

                    if (lightState === 'red' && newTimer >= nextTurnTime) {
                        // Поворачиваемся обратно
                        setLightState('green');
                        setDollFacing('left');
                        setTurningTimer(0);
                        // Следующий поворот через 3-6 секунд
                        setNextTurnTime(Math.random() * 3000 + 3000);
                        return 0;
                    }

                    return newTimer;
                });
            }, 100);
        }

        return () => clearInterval(turnInterval);
    }, [gameState, lightState, nextTurnTime]);

    // Обработка нажатий клавиш
    const handleKeyDown = useCallback((e) => {
        if (gameState !== 'playing') return;

        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            setKeysPressed(prev => new Set(prev).add(e.key));
            setIsMoving(true);
        }
    }, [gameState]);

    const handleKeyUp = useCallback((e) => {
        if (gameState !== 'playing') return;

        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            setKeysPressed(prev => {
                const newKeys = new Set(prev);
                newKeys.delete(e.key);
                if (newKeys.size === 0) {
                    setIsMoving(false);
                }
                return newKeys;
            });
        }
    }, [gameState]);

    // Подписка на события клавиатуры
    useEffect(() => {
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    // Движение осьминога
    useEffect(() => {
        let moveInterval;

        if (gameState === 'playing' && isMoving && keysPressed.size > 0) {
            // Проверка на красный свет
            if (lightState === 'red') {
                setGameState('lost');
                return;
            }

            moveInterval = setInterval(() => {
                setOctopusPosition(prev => {
                    let newPos = prev;

                    if (keysPressed.has('ArrowRight')) {
                        newPos += OCTOPUS_SPEED;
                    }
                    if (keysPressed.has('ArrowLeft')) {
                        newPos -= OCTOPUS_SPEED;
                    }

                    // Ограничения поля
                    newPos = Math.max(2, Math.min(FINISH_LINE, newPos));

                    // Проверка победы
                    if (newPos >= FINISH_LINE) {
                        setGameState('won');
                    }

                    return newPos;
                });
            }, 50);
        }

        return () => clearInterval(moveInterval);
    }, [gameState, isMoving, keysPressed, lightState]);

    // Мобильное управление
    const handleMobileMove = (direction) => {
        if (gameState !== 'playing') return;

        const key = direction === 'left' ? 'ArrowLeft' : 'ArrowRight';
        setKeysPressed(prev => new Set(prev).add(key));
        setIsMoving(true);
    };

    const handleMobileStop = (direction) => {
        if (gameState !== 'playing') return;

        const key = direction === 'left' ? 'ArrowLeft' : 'ArrowRight';
        setKeysPressed(prev => {
            const newKeys = new Set(prev);
            newKeys.delete(key);
            if (newKeys.size === 0) {
                setIsMoving(false);
            }
            return newKeys;
        });
    };

    // Получение цвета индикатора
    const getLightColor = () => {
        switch (lightState) {
            case 'green': return 'bg-green-500';
            case 'red': return 'bg-red-500';
            case 'turning': return 'bg-yellow-500';
            default: return 'bg-gray-500';
        }
    };

    // Получение текста состояния
    const getStateText = () => {
        switch (lightState) {
            case 'green': return 'GREEN LIGHT';
            case 'red': return 'RED LIGHT';
            case 'turning': return 'TURNING...';
            default: return '';
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-2 sm:p-4">
            <div className="max-w-6xl mx-auto">
                {/* Заголовок */}
                <div className="text-center mb-4 sm:mb-6">
                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-pink-600 mb-2">
                        <span className="block sm:inline">🟢🔴 Red Light,</span>
                        <span className="block sm:inline"> Green Light</span>
                    </h1>
                    <p className="text-sm sm:text-base md:text-lg text-gray-700 px-2">
                        Reach the finish line—but don't get caught by the doll!
                    </p>
                </div>

                {/* Игровая панель */}
                <div className="bg-gradient-to-b from-gray-800 to-gray-900 rounded-lg sm:rounded-xl shadow-2xl p-3 sm:p-4 md:p-6 mb-4 border-2 sm:border-4 border-gray-700">
                    {/* Статистика игры */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                            <div className="text-sm sm:text-base md:text-lg font-semibold text-orange-400 bg-gray-700 px-2 sm:px-3 py-1 rounded">
                                ⏱️ Time: {timeLeft}s
                            </div>
                            <div className="text-sm sm:text-base md:text-lg font-semibold text-pink-400 bg-gray-700 px-2 sm:px-3 py-1 rounded">
                                📊 {Math.round((octopusPosition / FINISH_LINE) * 100)}%
                            </div>
                        </div>

                        {/* Индикатор света */}
                        <div className="flex items-center space-x-2 sm:space-x-3 bg-black px-2 sm:px-4 py-1 sm:py-2 rounded-lg">
                            <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full border-2 ${
                                lightState === 'green' ? 'bg-green-500 border-green-300 shadow-green-500/50' :
                                    lightState === 'red' ? 'bg-red-500 border-red-300 shadow-red-500/50' :
                                        'bg-yellow-500 border-yellow-300 shadow-yellow-500/50'
                            } shadow-lg animate-pulse`}></div>
                            <span className={`font-bold text-sm sm:text-base md:text-lg ${
                                lightState === 'green' ? 'text-green-400' :
                                    lightState === 'red' ? 'text-red-400' :
                                        'text-yellow-400'
                            }`}>
                                <span className="hidden sm:inline">{getStateText()}</span>
                                <span className="sm:hidden">
                                    {lightState === 'green' ? 'GO' : lightState === 'red' ? 'STOP' : 'WAIT'}
                                </span>
                            </span>
                        </div>
                    </div>

                    {/* Полоса прогресса */}
                    <div className="w-full bg-gray-700 rounded-full h-3 sm:h-4 mb-4 sm:mb-6 border-2 border-gray-600">
                        <div
                            className="bg-gradient-to-r from-pink-500 to-orange-500 h-full rounded-full transition-all duration-300 relative overflow-hidden"
                            style={{ width: `${(octopusPosition / FINISH_LINE) * 100}%` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
                        </div>
                    </div>

                    {/* Игровое поле */}
                    <div className="relative bg-gradient-to-b from-orange-100 to-orange-200 h-48 sm:h-56 md:h-64 lg:h-72 rounded-lg border-2 sm:border-4 border-orange-400 overflow-hidden shadow-inner">
                        {/* Песчаная текстура */}
                        <div className="absolute inset-0 opacity-20">
                            <div className="w-full h-full bg-gradient-to-br from-yellow-200 via-orange-200 to-brown-200"></div>
                        </div>

                        {/* Разметка поля */}
                        <div className="absolute inset-0">
                            {[20, 40, 60, 80].map(pos => (
                                <div
                                    key={pos}
                                    className="absolute top-0 bottom-0 w-px bg-orange-300 opacity-50"
                                    style={{ left: `${pos}%` }}
                                />
                            ))}
                            <div className="absolute left-0 right-0 h-px bg-orange-300 opacity-50 top-1/3"></div>
                            <div className="absolute left-0 right-0 h-px bg-orange-300 opacity-50 bottom-1/3"></div>
                        </div>

                        {/* Финишная линия */}
                        <div
                            className="absolute top-0 bottom-0 w-1 bg-gradient-to-b from-red-600 to-red-800 shadow-lg"
                            style={{ left: `${FINISH_LINE}%` }}
                        >
                            <div className="absolute top-1 left-1 text-xs font-bold text-white">🏁</div>
                            <div className="absolute top-4 -left-6 sm:-left-8 text-xs font-bold text-red-700 bg-white px-1 rounded">
                                Finish
                            </div>
                        </div>

                        {/* Стартовая линия */}
                        <div className="absolute top-0 bottom-0 left-4 sm:left-6 w-1 bg-gradient-to-b from-green-600 to-green-800 shadow-lg">
                            <div className="absolute top-1 left-1 text-xs font-bold text-white">🚀</div>
                            <div className="absolute top-4 -left-4 sm:-left-6 text-xs font-bold text-green-700 bg-white px-1 rounded">
                                START
                            </div>
                        </div>

                        {/* Кукла */}
                        <div
                            className={`absolute right-2 sm:right-4 md:right-6 top-2 sm:top-4 md:top-6 transition-transform duration-1000 ${
                                dollFacing === 'right' ? 'transform scale-x-[-1]' : ''
                            }`}
                        >
                            <div className="relative">
                                {dollFacing === 'right' ? <img src={require('./kukla.png')} width={isMobile ? 60 : 100} height={isMobile ? 70 : 130} /> : <img src={require('./kukla-back.png')} width={isMobile ? 60 : 100} height={isMobile ? 70 : 130}  />}
                                {/*<div className="w-12 h-16 sm:w-16 sm:h-20 md:w-20 md:h-24 lg:w-24 lg:h-28 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-lg border-2 border-orange-600 relative">*/}
                                {/*    /!* Лицо куклы *!/*/}
                                {/*    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-pink-200 rounded-full border border-pink-400">*/}
                                {/*        /!* Глаза *!/*/}
                                {/*        <div className="absolute top-2 left-2 w-1 h-1 sm:w-2 sm:h-2 bg-black rounded-full"></div>*/}
                                {/*        <div className="absolute top-2 right-2 w-1 h-1 sm:w-2 sm:h-2 bg-black rounded-full"></div>*/}
                                {/*        /!* Рот *!/*/}
                                {/*        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-1 sm:w-3 sm:h-1 bg-red-500 rounded-full"></div>*/}
                                {/*    </div>*/}
                                {/*</div>*/}
                                <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-6 h-1 sm:w-8 sm:h-2 bg-black opacity-20 rounded-full blur-sm"></div>
                            </div>
                        </div>

                        {/* Осьминог-игрок */}
                        <div
                            className={`absolute bottom-4 sm:bottom-6 md:bottom-8 transform transition-all duration-100 ${
                                isMoving && lightState === 'green' ? 'animate-bounce' : ''
                            }`}
                            style={{ left: `${octopusPosition}%` }}
                        >
                            <img src={require('./octo.png')} width={isMobile ? 70 : 120} height={isMobile ? 70 :120} />
                            {/*<div className="relative">*/}
                            {/*    <div className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 bg-gradient-to-b from-pink-400 to-pink-600 rounded-full border-2 border-pink-700 relative">*/}
                            {/*        /!* Глаза *!/*/}
                            {/*        <div className="absolute top-1 left-1 w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full">*/}
                            {/*            <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-black rounded-full mt-0.5 ml-0.5"></div>*/}
                            {/*        </div>*/}
                            {/*        <div className="absolute top-1 right-1 w-1 h-1 sm:w-2 sm:h-2 bg-white rounded-full">*/}
                            {/*            <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-black rounded-full mt-0.5 ml-0.5"></div>*/}
                            {/*        </div>*/}
                            {/*        /!* Рот *!/*/}
                            {/*        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-0.5 sm:w-3 sm:h-1 bg-red-500 rounded-full"></div>*/}
                            {/*    </div>*/}

                            {/*    /!* Щупальца *!/*/}
                            {/*    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5 sm:space-x-1">*/}
                            {/*        <div className="w-0.5 h-3 sm:w-1 sm:h-4 md:h-6 bg-gradient-to-b from-pink-500 to-pink-700 rounded-full transform rotate-12"></div>*/}
                            {/*        <div className="w-0.5 h-3 sm:w-1 sm:h-4 md:h-6 bg-gradient-to-b from-pink-500 to-pink-700 rounded-full"></div>*/}
                            {/*        <div className="w-0.5 h-3 sm:w-1 sm:h-4 md:h-6 bg-gradient-to-b from-pink-500 to-pink-700 rounded-full transform -rotate-12"></div>*/}
                            {/*    </div>*/}

                            {/*    /!* Эффекты *!/*/}
                            {/*    {isMoving && lightState === 'green' && (*/}
                            {/*        <div className="absolute -bottom-4 sm:-bottom-6 left-1/2 transform -translate-x-1/2 text-xs opacity-60">*/}
                            {/*            💨*/}
                            {/*        </div>*/}
                            {/*    )}*/}
                            {/*    {lightState === 'red' && (*/}
                            {/*        <div className="absolute -top-4 sm:-top-6 left-1/2 transform -translate-x-1/2 text-sm sm:text-lg animate-pulse">*/}
                            {/*            😰*/}
                            {/*        </div>*/}
                            {/*    )}*/}

                            {/*    <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-4 h-1 sm:w-6 sm:h-2 bg-black opacity-20 rounded-full blur-sm"></div>*/}
                            {/*</div>*/}
                        </div>

                        {/* Атмосферные элементы */}
                        <div className="absolute top-2 left-2 sm:left-4 text-xs opacity-50">🌤️</div>
                        <div className="absolute top-4 right-12 sm:right-16 text-xs opacity-50">🌤️</div>
                        <div className="absolute bottom-2 left-6 sm:left-8 text-xs opacity-30">🌾</div>
                        <div className="absolute bottom-4 right-16 sm:right-20 text-xs opacity-30">🌾</div>

                        {/* Оверлей результата */}
                        {gameState !== 'playing' && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                                <div className="text-center text-white max-w-xs sm:max-w-sm">
                                    {gameState === 'ready' && (
                                        <div>
                                            <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4">🎮</div>
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Ready?</h2>
                                            <p className="text-sm sm:text-base mb-2 sm:mb-4">Use ← → or buttons to move</p>
                                            <p className="text-xs sm:text-sm">Stop when doll is looking!</p>
                                        </div>
                                    )}
                                    {gameState === 'won' && (
                                        <div>
                                            <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4">🎉</div>
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Victory!</h2>
                                            <p className="text-sm sm:text-base mb-2 sm:mb-4">Octopus reached the finish!</p>
                                        </div>
                                    )}
                                    {gameState === 'lost' && (
                                        <div>
                                            <div className="text-4xl sm:text-5xl md:text-6xl mb-2 sm:mb-4">💥</div>
                                            <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-2">Failed!</h2>
                                            <p className="text-sm sm:text-base mb-2 sm:mb-4">
                                                {timeLeft === 0 ? 'Time\'s up!' : 'Doll spotted movement!'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Кнопки управления */}
                    <div className="flex justify-center space-x-2 sm:space-x-4 mt-4 sm:mt-6">
                        {gameState === 'ready' && (
                            <button
                                onClick={startGame}
                                className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-semibold hover:from-pink-600 hover:to-purple-600 transition-all duration-300 shadow-lg text-sm sm:text-base"
                            >
                                🎮 Start Game
                            </button>
                        )}
                        {(gameState === 'won' || gameState === 'lost') && (
                            <button
                                onClick={resetGame}
                                className="bg-gradient-to-r from-blue-500 to-teal-500 text-white px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-semibold hover:from-blue-600 hover:to-teal-600 transition-all duration-300 shadow-lg text-sm sm:text-base"
                            >
                                🔄 Play Again
                            </button>
                        )}
                    </div>

                    {/* Мобильное управление */}
                    <div className="mt-4 sm:mt-6 block sm:hidden">
                        <div className="flex justify-center space-x-4">
                            <button
                                onTouchStart={() => handleMobileMove('left')}
                                onTouchEnd={() => handleMobileStop('left')}
                                onMouseDown={() => handleMobileMove('left')}
                                onMouseUp={() => handleMobileStop('left')}
                                onMouseLeave={() => handleMobileStop('left')}
                                className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 px-6 py-3 rounded-full font-semibold transition-all duration-200 text-sm select-none"
                            >
                                ← Left
                            </button>
                            <button
                                onTouchStart={() => handleMobileMove('right')}
                                onTouchEnd={() => handleMobileStop('right')}
                                onMouseDown={() => handleMobileMove('right')}
                                onMouseUp={() => handleMobileStop('right')}
                                onMouseLeave={() => handleMobileStop('right')}
                                className="bg-gray-200 hover:bg-gray-300 active:bg-gray-400 px-6 py-3 rounded-full font-semibold transition-all duration-200 text-sm select-none"
                            >
                                Right →
                            </button>
                        </div>
                    </div>
                </div>

                {/* Инструкции */}
                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6">
                    <h3 className="text-lg sm:text-xl font-bold text-pink-600 mb-3">📋 Game Rules</h3>
                    <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                        <li>• Use ← → keys or buttons to move</li>
                        <li>• Move when doll turns away (green)</li>
                        <li>• Stop when doll looks at you (red)</li>
                        <li>• Reach finish line in 45 seconds</li>
                        <li>• Moving during red light = fail!</li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default RedGreenLight;
