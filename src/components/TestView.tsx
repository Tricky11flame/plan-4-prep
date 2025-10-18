import { useState, useEffect } from 'react';
import type { TestSession } from '../types';

interface TestViewProps {
  test: TestSession;
  onNextQuestion: () => void;
  onEndTest: () => void;
}

export default function TestView({ test, onNextQuestion, onEndTest }: TestViewProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const { questions, currentIndex } = test;
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    setIsFlipped(false);
  }, [currentIndex]);

  if (!currentQuestion) return null;

  return (
    <div className="w-full max-w-3xl">
      <div className="flex justify-between items-center mb-4">
        <p className="font-semibold text-lg font-mono">
          Question {currentIndex + 1} of {questions.length}
        </p>
        <button
          onClick={onEndTest}
          className="px-4 py-2 font-mono border-[1.5pt] border-black bg-red-500 text-white font-semibold rounded-md shadow-sm hover:bg-red-700"
        >
          End Test
        </button>
      </div>

      <div className={`flip-card h-96 bg-transparent rounded-lg ${isFlipped ? 'flipped' : ''}`}>
        <div className="flip-card-inner shadow-lg">
          <div className="flip-card-front text-black bg-red-50 border-black border-[1.5pt] text-2xl  text-center">
            {currentQuestion.q}
          </div>
          <div className="flip-card-back bg-blue-100 text-black border-black border-[1.5pt] text-2xl text-center">
            {currentQuestion.a}
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center space-x-4">
        {!isFlipped ? (
           <button
            onClick={() => setIsFlipped(true)}
            className="px-8 py-3 w-48 border-black border-[1.5pt] bg-gray-700 text-white font-mono font-bold rounded-md shadow-sm hover:bg-gray-800"
          >
            Show Answer
          </button>
        ) : (
          <button
            onClick={onNextQuestion}
            className="px-8 py-3 w-48 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700"
          >
            Next Question
          </button>
        )}
      </div>
    </div>
  );
}