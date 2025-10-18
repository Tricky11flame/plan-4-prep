import { useState } from 'react';
import  type{ TestSession } from '../types';

interface SetupViewProps {
  onStartTest: (numQuestions: number) => void;
  onStartCourse: () => void;
  savedCourse: TestSession | null;
  onResumeCourse: () => void;
  onDiscardCourse: () => void;
}

export default function SetupView({ onStartTest, onStartCourse, savedCourse, onResumeCourse, onDiscardCourse }: SetupViewProps) {
  const [numQuestions, setNumQuestions] = useState(10);

  return (
    <div className="text-center max-w-lg">
      {savedCourse && (
        <div className="mb-8">
          <div className="bg-purple-100 p-6 rounded-lg shadow-md  border-black border-[1.5pt]  ">
            <h3 className="text-xl font-semibold mb-2">Unfinished Course Found!</h3>
            <p className="text-black mb-4 font-mono">
              You left off on question {savedCourse.currentIndex + 1} of {savedCourse.questions.length}.
            </p>
            <button
              onClick={onResumeCourse}
              className="w-full px-6 py-3 bg-rose-500  text-white text-xl border-black border-[1.5pt] font-bold rounded-md shadow-sm hover:bg-rose-600 mb-3 transition-transform transform hover:scale-105"
            >
              Resume Course
            </button>
            <button
              onClick={onDiscardCourse}
              className=" border-[1.5pt] border-black m-auto bg-indigo-500 px-4 py-2 text-sm text-white font-semibold hover:bg-indigo-600 rounded-md"
            >
              Discard Progress & Start New
            </button>
          </div>
        </div>
      )}

      <h2 className="text-6xl font-extrabold  font-stretch-150% mb-4"><span className=' text-7xl text-red-500 '>Ready</span><span className=' text-5xl text-black'> to </span><span className=' text-7xl text-blue-500'> Start?</span> </h2>
      <p className="text-gray-600 mb-8 font-mono">Load and select your materials, then choose how you want to practice.</p>

      <div className="bg-white p-6 rounded-lg  border-black border-[1.5pt] drop-shadow-md">
        <h3 className="text-xl font-semibold mb-4">Generate a Random Test</h3>
        <div className="flex items-center justify-center space-x-3 mb-4">
          <label htmlFor="num-questions" className="font-medium">Questions:</label>
          <input
            type="number"
            id="num-questions"
            value={numQuestions}
            onChange={(e) => setNumQuestions(Math.max(1, parseInt(e.target.value, 10) || 1))}
            min="1"
            className="w-24 p-2 text-center border-black border-[1.5pt] rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>
        <button
          onClick={() => onStartTest(numQuestions)}
          className="px-16 mx-auto  py-3 bg-blue-500 text-white font-semibold font-stretch-200% border-black border-[1.5pt] rounded-md shadow-sm hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mb-4 transition-transform transform hover:scale-105"
        >
          Start Random Test
        </button>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-2 bg-white text-sm text-gray-500">OR</span>
          </div>
        </div>

        <h3 className="text-xl font-semibold mb-4">Take a Course</h3>
        <p className="text-sm text-gray-500 mb-4 font-mono">Progress through all questions from selected materials.</p>
        <button
          onClick={onStartCourse}
          className="w-full px-6 py-3 text-2xl bg-red-500 text-white font-semibold font-stretch-200% border-black border-[1.5pt] rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-transform transform hover:scale-105"
        >
          Start Course
        </button>
      </div>
    </div>
  );
}