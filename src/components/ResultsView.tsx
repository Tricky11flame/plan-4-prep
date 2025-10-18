interface ResultsViewProps {
  completedCount: number;
  onBackToMain: () => void;
}

export default function ResultsView({ completedCount, onBackToMain }: ResultsViewProps) {
  return (
    <div className="text-center max-w-lg">
      <h2 className="text-3xl font-bold mb-4">Session Complete!</h2>
      <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
        <p className="text-xl text-gray-700 mb-8">
          You've completed {completedCount} questions. Well done!
        </p>
        <button
          onClick={onBackToMain}
          className="w-full px-6 py-3 bg-indigo-600 text-white font-bold rounded-md shadow-sm hover:bg-indigo-700"
        >
          Back to Main Menu
        </button>
      </div>
    </div>
  );
}