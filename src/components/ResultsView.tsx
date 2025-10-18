interface ResultsViewProps {
  completedCount: number;
  onBackToMain: () => void;
}

export default function ResultsView({ completedCount, onBackToMain }: ResultsViewProps) {
  return (
    <div className="text-center max-w-lg">
      <h2 className="text-3xl font-bold mb-4">Session Complete!</h2>
      <div className="bg-white p-8 rounded-lg shadow-md  border-black border-[1.5pt]">
        <p className="text-xl text-gray-700 mb-8 font-mono">
          You've completed {completedCount} questions. Well done!
        </p>
        <button
          onClick={onBackToMain}
          className="w-full px-6 py-3 border-[1.5pt] border-black bg-blue-500 text-white font-bold rounded-md shadow-sm hover:bg-blue-700"
        >
          Back to Main Menu
        </button>
      </div>
    </div>
  );
}