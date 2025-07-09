import React, { useState, useEffect, useReducer, useCallback } from 'react';

const GAME_DURATION = 60; // 1 минута
const BRIDGE_LENGTH = 5;
const BRIDGE_WIDTH = 2;

// Состояния игры
const GAME_STATES = {
    WAITING: 'waiting',
    PLAYING: 'playing',
    WON: 'won',
    LOST: 'lost'
};

// Редюсер для игровой логики
const gameReducer = (state, action) => {
    switch (action.type) {
        case 'START_GAME':
            return {
                ...state,
                gameState: GAME_STATES.PLAYING,
                playerPosition: { row: 0, col: 0 },
                timeLeft: GAME_DURATION,
                safeTiles: action.safeTiles
            };
        case 'MOVE_PLAYER':
            const newPosition = action.position;
            const tileKey = `${newPosition.row}-${newPosition.col}`;

            if (state.safeTiles.has(tileKey)) {
                // Безопасная плитка
                if (newPosition.row === BRIDGE_LENGTH - 1) {
                    // Победа!
                    return {
                        ...state,
                        playerPosition: newPosition,
                        gameState: GAME_STATES.WON
                    };
                }
                return {
                    ...state,
                    playerPosition: newPosition
                };
            } else {
                // Плитка разбилась
                return {
                    ...state,
                    gameState: GAME_STATES.LOST,
                    brokenTile: tileKey
                };
            }
        case 'TICK':
            if (state.timeLeft <= 1) {
                return {
                    ...state,
                    timeLeft: 0,
                    gameState: GAME_STATES.LOST
                };
            }
            return {
                ...state,
                timeLeft: state.timeLeft - 1
            };
        case 'RESET':
            return {
                gameState: GAME_STATES.WAITING,
                playerPosition: { row: 0, col: 0 },
                timeLeft: GAME_DURATION,
                safeTiles: new Set(),
                brokenTile: null
            };
        default:
            return state;
    }
};

// Генерация безопасных плиток
const generateSafeTiles = () => {
    const safeTiles = new Set();

    // Для каждого ряда случайно выбираем одну безопасную плитку
    for (let row = 0; row < BRIDGE_LENGTH; row++) {
        const safeCol = Math.random() < 0.5 ? 0 : 1;
        safeTiles.add(`${row}-${safeCol}`);
    }

    return safeTiles;
};

const GlassBridgeGame = () => {
    const [state, dispatch] = useReducer(gameReducer, {
        gameState: GAME_STATES.WAITING,
        playerPosition: { row: 0, col: 0 },
        timeLeft: GAME_DURATION,
        safeTiles: new Set(),
        brokenTile: null
    });

    // Таймер
    useEffect(() => {
        if (state.gameState === GAME_STATES.PLAYING) {
            const timer = setInterval(() => {
                dispatch({ type: 'TICK' });
            }, 1000);
            return () => clearInterval(timer);
        }
    }, [state.gameState]);

    // Обработка клика по плитке
    const handleTileClick = useCallback((row, col) => {
        if (state.gameState !== GAME_STATES.PLAYING) return;

        const { row: currentRow, col: currentCol } = state.playerPosition;

        // Можно двигаться только на следующий ряд или в том же ряду
        if (row === currentRow + 1 || (row === currentRow && col !== currentCol)) {
            dispatch({ type: 'MOVE_PLAYER', position: { row, col } });
        }
    }, [state.gameState, state.playerPosition]);

    const startGame = () => {
        const safeTiles = generateSafeTiles();
        dispatch({ type: 'START_GAME', safeTiles });
    };

    const resetGame = () => {
        dispatch({ type: 'RESET' });
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getTileClass = (row, col) => {
        const tileKey = `${row}-${col}`;
        const isPlayer = state.playerPosition.row === row && state.playerPosition.col === col;
        const isBroken = state.brokenTile === tileKey;
        const isSafe = state.safeTiles.has(tileKey) && (state.gameState === GAME_STATES.WON || state.gameState === GAME_STATES.LOST);

        const { row: currentRow, col: currentCol } = state.playerPosition;
        const canClick = state.gameState === GAME_STATES.PLAYING &&
            (row === currentRow + 1 || (row === currentRow && col !== currentCol));

        let classes = "w-24 h-20 border-2 border-gray-300 relative transition-all duration-300 ";

        if (isBroken) {
            classes += "bg-red-500 border-red-700 shadow-inner ";
        } else if (isSafe) {
            classes += "bg-green-400 border-green-600 shadow-lg ";
        } else {
            classes += "bg-blue-200 border-blue-400 shadow-md ";
        }

        if (canClick) {
            classes += "hover:bg-blue-300 cursor-pointer hover:scale-105 ";
        } else if (state.gameState === GAME_STATES.PLAYING) {
            classes += "cursor-not-allowed opacity-50 ";
        }

        if (isPlayer) {
            classes += "ring-4 ring-pink-500 ";
        }

        return classes;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-red-900 to-black text-white font-mono">
            {/* Заголовок и таймер */}
            <div className="pl-20 flex justify-between items-center p-6 bg-red-800 shadow-lg">
                <h1 className="text-3xl font-bold text-yellow-300">🦑 GLASS BRIDGE</h1>
                <div className="text-2xl font-bold bg-black px-4 py-2 rounded border-2 border-red-500">
                    {formatTime(state.timeLeft)}
                </div>
            </div>

            {/* Игровое поле */}
            <div className="flex flex-col items-center py-8">
                {state.gameState === GAME_STATES.WAITING && (
                    <div className="text-center mb-8">
                        <h2 className="text-2xl mb-4 text-yellow-300">Welcome to the game!</h2>
                        <p className="text-lg mb-4">Cross the glass bridge within 1 minute</p>
                        <p className="text-sm mb-6 text-gray-300">
                            Click on the glass panels to move. One panel in each row is strong, the other will break!
                        </p>
                        <button
                            onClick={startGame}
                            className="bg-pink-600 hover:bg-pink-700 px-8 py-3 rounded-lg text-xl font-bold transition-colors"
                        >
                            START GAME
                        </button>
                    </div>
                )}


                {state.gameState === GAME_STATES.PLAYING && (
                    <div className="mb-4 text-center">
                        <p className="text-lg text-yellow-300">
                            Position: Row {state.playerPosition.row + 1}/{BRIDGE_LENGTH}
                        </p>
                        <p className="text-sm text-gray-300 mt-2">
                            Click a panel in the next row or switch position in the current row
                        </p>
                    </div>
                )}

                {/* Мост */}
                {/* Bridge */}
                <div className="bg-gray-900 p-6 rounded-lg shadow-2xl border-2 border-red-500">
                    <div className="grid gap-2" style={{ gridTemplateColumns: `repeat(${BRIDGE_WIDTH}, 1fr)` }}>
                        {Array.from({ length: BRIDGE_LENGTH }, (_, row) =>
                            Array.from({ length: BRIDGE_WIDTH }, (_, col) => (
                                <div
                                    key={`${row}-${col}`}
                                    className={getTileClass(row, col)}
                                    onClick={() => handleTileClick(row, col)}
                                >
                                    {state.playerPosition.row === row && state.playerPosition.col === col && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-2xl animate-bounce">
                                                <img src={require('./octo.png')} />
                                            </div>
                                        </div>
                                    )}
                                    {state.brokenTile === `${row}-${col}` && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="text-xl">💥</div>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Результат игры */}
                {state.gameState === GAME_STATES.WON && (
                    <div className="text-center mt-8 p-6 bg-green-800 rounded-lg border-2 border-green-500">
                        <h2 className="text-3xl mb-4 text-yellow-300">🎉 VICTORY!</h2>
                        <p className="text-lg mb-4">You successfully crossed the glass bridge!</p>
                        <button
                            onClick={resetGame}
                            className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg font-bold transition-colors"
                        >
                            PLAY AGAIN
                        </button>
                    </div>
                )}

                {state.gameState === GAME_STATES.LOST && (
                    <div className="text-center mt-8 p-6 bg-red-800 rounded-lg border-2 border-red-500">
                        <h2 className="text-3xl mb-4 text-yellow-300">💀 DEFEAT</h2>
                        <p className="text-lg mb-4">
                            {state.timeLeft === 0 ? 'Time’s up!' : 'The glass shattered!'}
                        </p>
                        <button
                            onClick={resetGame}
                            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-bold transition-colors"
                        >
                            TRY AGAIN
                        </button>
                    </div>
                )}


                {/* Инструкции */}
                <div className="mt-8 p-4 bg-gray-800 rounded-lg border border-gray-600 max-w-md text-center">
                    <h3 className="text-lg font-bold mb-2 text-yellow-300">Controls:</h3>
                    <div className="text-sm text-gray-300">
                        <p>🖱️ Click on the glass panels to move</p>
                        <p>🐙 - Your character</p>
                        <p>💥 - Broken glass</p>
                        <p>⚠️ You cannot skip rows!</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default GlassBridgeGame;
