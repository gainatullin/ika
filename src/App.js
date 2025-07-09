import React, { useState } from 'react';
import { Brain, Gamepad2, Layers, Eye, Home, ArrowLeft } from 'lucide-react';

// Импортируем компоненты (в реальном приложении это будут отдельные файлы)
import GlassBridge from "./GlassBridge";
import RedGreenLight from "./RedGreenLight";
import IkaQuiz from "./IkaQuiz";

// Заглушки для демонстрации - замените на ваши реальные компоненты
// const GlassBridge = () => (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center">
//         <div className="text-center text-white">
//             <h1 className="text-4xl font-bold mb-4">Glass Bridge Game</h1>
//             <p className="text-xl text-gray-300">Игра "Стеклянный мост"</p>
//         </div>
//     </div>
// );
//
// const RedGreenLight = () => (
//     <div className="min-h-screen bg-gradient-to-br from-red-900 to-green-900 flex items-center justify-center">
//         <div className="text-center text-white">
//             <h1 className="text-4xl font-bold mb-4">Red Green Light Game</h1>
//             <p className="text-xl text-gray-300">Игра "Красный свет, зеленый свет"</p>
//         </div>
//     </div>
// );
//
// const IkaQuiz = () => (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
//         <div className="text-center text-white">
//             <h1 className="text-4xl font-bold mb-4">Ika Quiz</h1>
//             <p className="text-xl text-gray-300">Квиз по экосистеме Ika</p>
//         </div>
//     </div>
// );

const App = () => {
    const [currentView, setCurrentView] = useState('home');
    const menuItems = [
        {
            id: 'quiz',
            name: 'Ika Quiz',
            description: 'Test your knowledge of the Ika ecosystem',
            icon: Brain,
            gradient: 'from-blue-500 to-purple-600',
            bgGradient: 'from-blue-500/20 to-purple-600/20'
        },
        {
            id: 'glass-bridge',
            name: 'Glass Bridge',
            description: 'Cross the glass bridge',
            icon: Layers,
            gradient: 'from-cyan-500 to-blue-600',
            bgGradient: 'from-cyan-500/20 to-blue-600/20'
        },
        {
            id: 'red-green-light',
            name: 'Red Green Light',
            description: 'Stop on red light!',
            icon: Eye,
            gradient: 'from-red-500 to-green-500',
            bgGradient: 'from-red-500/20 to-green-500/20'
        }
    ];

    const renderContent = () => {
        switch (currentView) {
            case 'quiz':
                return <IkaQuiz />;
            case 'glass-bridge':
                return <GlassBridge />;
            case 'red-green-light':
                return <RedGreenLight />;
            default:
                return <HomePage />;
        }
    };

    const HomePage = () => (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center p-4">
            <div className="max-w-6xl w-full">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
                        <Gamepad2 className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                        Gaming Hub
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Choose a quiz or a game to begin. Test your knowledge about Ika or try your luck in challenges!
                    </p>
                </div>


                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {menuItems.map((item) => {
                        const IconComponent = item.icon;
                        return (
                            <button
                                key={item.id}
                                onClick={() => setCurrentView(item.id)}
                                className="group relative overflow-hidden bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 hover:border-gray-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
                            >
                                {/* Background gradient on hover */}
                                <div className={`absolute inset-0 bg-gradient-to-r ${item.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${item.gradient} rounded-full mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <IconComponent className="w-8 h-8 text-white" />
                                    </div>

                                    {/* Content */}
                                    <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-white transition-colors">
                                        {item.name}
                                    </h3>
                                    <p className="text-gray-400 group-hover:text-gray-200 transition-colors">
                                        {item.description}
                                    </p>

                                    {/* Hover arrow */}
                                    <div className="flex items-center justify-center mt-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                        <span className="text-white font-semibold">Start</span>
                                        <ArrowLeft className="w-5 h-5 text-white ml-2 rotate-180" />
                                    </div>
                                </div>
                            </button>
                        );
                    })}
                </div>


                {/* Footer */}
                <div className="text-center mt-12">
                    <p className="text-gray-500 text-sm">
                    </p>
                </div>
            </div>
        </div>
    );

    // Показываем кнопку "Домой" только если не на главной странице
    const showBackButton = currentView !== 'home';

    return (
        <div className="relative">
            {/* Back to Home Button */}
            {showBackButton && (
                <div className="fixed top-6 left-6 z-50">
                    <button
                        onClick={() => setCurrentView('home')}
                        className="bg-gray-800/80 backdrop-blur-xl border border-gray-700 hover:border-gray-600 text-white rounded-full p-3 transition-all duration-300 transform hover:scale-110 hover:shadow-xl"
                    >
                        <Home className="w-6 h-6" />
                    </button>
                </div>
            )}

            {/* Content */}
            {renderContent()}
        </div>
    );
};

export default App;
