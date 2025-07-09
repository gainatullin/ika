import React, { useState } from 'react';
import { Check, X, ArrowRight, RotateCcw } from 'lucide-react';

const IkaQuiz = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState({});
    const [showResults, setShowResults] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null);

    const questions = [
        {
            id: 1,
            question: "What is dWallet in the Ika ecosystem?",
            options: [
                "A decentralized wallet controlled by both the network and the user",
                "A regular software wallet",
                "A centralized storage solution"
            ],
            correct: 0,
            type: "multiple"
        },
        {
            id: 2,
            question: "What is the main advantage of the 2PC-MPC protocol compared to traditional MPC networks?",
            options: [
                "Enables scaling the network to thousands of validators without increasing user load",
                "Requires only one validator",
                "Does not support parallel signatures"
            ],
            correct: 0,
            type: "multiple"
        },
        {
            id: 3,
            question: "What does Zero Trust mean in Ika's architecture?",
            options: [
                "All network participants are considered potentially unreliable; security is ensured through cryptography",
                "Trust is based on reputation",
                "Trust is based on a centralized administrator"
            ],
            correct: 0,
            type: "multiple"
        },
        {
            id: 4,
            question: "Which blockchains does Ika support for asset management?",
            options: [
                "Only Sui",
                "Bitcoin, Ethereum, Sui and others",
                "Only Ethereum"
            ],
            correct: 1,
            type: "multiple"
        },
        {
            id: 5,
            question: "How many signatures per second can the Ika network handle?",
            options: [
                "Up to 10",
                "Up to 100",
                "Up to 10,000"
            ],
            correct: 2,
            type: "multiple"
        },
        {
            id: 6,
            question: "Which scenarios is Ika suitable for?",
            options: [
                "DeFi, cross-chain transactions, decentralized storage, AI agents",
                "Mining only",
                "NFT only"
            ],
            correct: 0,
            type: "multiple"
        },
        {
            id: 7,
            question: "What is the main function of the IKA token?",
            options: [
                "Gas payment, staking, governance participation",
                "NFT only",
                "Voting only"
            ],
            correct: 0,
            type: "multiple"
        },
        {
            id: 8,
            question: "dWallet allows users to export the full private key.",
            options: ["True", "False"],
            correct: 1,
            type: "boolean"
        },
        {
            id: 9,
            question: "Which mechanism enables Ika to manage assets across different chains without bridges and wrappers?",
            options: [
                "dWallet + 2PC-MPC",
                "Centralized exchange",
                "Standard smart contracts"
            ],
            correct: 0,
            type: "multiple"
        },
        {
            id: 10,
            question: "Even if part of the Ika network nodes are compromised, the attacker cannot obtain the user’s private key.",
            options: ["True", "False"],
            correct: 0,
            type: "boolean"
        }
    ];

    const handleAnswerSelect = (answerIndex) => {
        setSelectedAnswer(answerIndex);
    };

    const handleNextQuestion = () => {
        if (selectedAnswer !== null) {
            setAnswers({
                ...answers,
                [currentQuestion]: selectedAnswer
            });

            if (currentQuestion < questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1);
                setSelectedAnswer(null);
            } else {
                setShowResults(true);
            }
        }
    };

    const calculateScore = () => {
        let correct = 0;
        questions.forEach((question, index) => {
            if (answers[index] === question.correct) {
                correct++;
            }
        });
        return correct;
    };

    const restartQuiz = () => {
        setCurrentQuestion(0);
        setAnswers({});
        setShowResults(false);
        setSelectedAnswer(null);
    };

    const getScoreColor = (score) => {
        if (score >= 8) return 'text-green-400';
        if (score >= 6) return 'text-yellow-400';
        return 'text-red-400';
    };

    const getScoreMessage = (score) => {
        if (score >= 8) return 'Excellent! You know the Ika ecosystem well';
        if (score >= 6) return 'Good! Consider studying the materials more deeply';
        return 'We recommend exploring the Ika documentation';
    };

    if (showResults) {
        const score = calculateScore();
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
                <div className="max-w-2xl w-full bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8 text-center">
                    <div className="mb-8">
                        <div className="text-6xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">
                            {score}/10
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Quiz Results</h2>
                        <p className={`text-xl ${getScoreColor(score)} mb-6`}>
                            {getScoreMessage(score)}
                        </p>
                    </div>

                    <div className="space-y-4 mb-8">
                        {questions.map((question, index) => (
                            <div key={question.id} className="flex items-center justify-between p-4 bg-gray-700/50 rounded-xl">
                                <span className="text-gray-300 text-sm">Question {index + 1}</span>
                                <div className="flex items-center space-x-2">
                                    {answers[index] === question.correct ? (
                                        <Check className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <X className="w-5 h-5 text-red-400" />
                                    )}
                                    <span className="text-white font-medium">
                    {answers[index] === question.correct ? 'Correct' : 'Incorrect'}
                  </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={restartQuiz}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center space-x-2 mx-auto"
                    >
                        <RotateCcw className="w-5 h-5" />
                        <span>Try again</span>
                    </button>
                </div>
            </div>
        );
    }

    const question = questions[currentQuestion];
    const progress = ((currentQuestion + 1) / questions.length) * 100;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center p-4">
            <div className="max-w-3xl w-full bg-gray-800/50 backdrop-blur-xl border border-gray-700 rounded-2xl p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                        Ika Ecosystem Quiz
                    </h1>
                    <p className="text-gray-400">Test your knowledge of Ika technologies</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-400">Progress</span>
                        <span className="text-sm text-gray-400">{currentQuestion + 1} из {questions.length}</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                        <div
                            className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>

                {/* Question */}
                <div className="mb-8">
                    <h2 className="text-2xl font-semibold text-white mb-6 leading-relaxed">
                        {question.question}
                    </h2>

                    <div className="space-y-4">
                        {question.options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(index)}
                                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-300 transform hover:scale-[1.02] ${
                                    selectedAnswer === index
                                        ? 'border-blue-500 bg-blue-500/20 text-blue-400'
                                        : 'border-gray-600 bg-gray-700/50 text-gray-300 hover:border-gray-500 hover:bg-gray-700'
                                }`}
                            >
                                <div className="flex items-center space-x-3">
                                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                                        selectedAnswer === index
                                            ? 'border-blue-500 bg-blue-500'
                                            : 'border-gray-500'
                                    }`}>
                                        {selectedAnswer === index && (
                                            <div className="w-2 h-2 bg-white rounded-full"></div>
                                        )}
                                    </div>
                                    <span className="flex-1 font-medium">{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Next Button */}
                <div className="flex justify-end">
                    <button
                        onClick={handleNextQuestion}
                        disabled={selectedAnswer === null}
                        className={`flex items-center space-x-2 px-8 py-3 rounded-xl font-semibold transition-all duration-300 transform ${
                            selectedAnswer !== null
                                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:scale-105'
                                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                        }`}
                    >
                        <span>{currentQuestion === questions.length - 1 ? 'Finish' : 'Next'}</span>
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default IkaQuiz;
