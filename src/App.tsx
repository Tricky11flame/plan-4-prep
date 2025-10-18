import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import SetupView from './components/SetupView';
import TestView from './components/TestView';
import ResultsView from './components/ResultsView';
import Notification from './components/Notification';
import type { StudyMaterial, TestSession, NotificationState, Question } from './types';
import { db } from './db'; // Import your new db file

// Helper function to shuffle an array
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

// const COURSE_STORAGE_KEY = 'studyToolCourseProgress';

export default function App() {
  
  const [view, setView] = useState<'setup' | 'test' | 'results'>('setup');
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [currentTest, setCurrentTest] = useState<TestSession | null>(null);
  const [savedCourse, setSavedCourse] = useState<TestSession | null>(null);
  const [notification, setNotification] = useState<NotificationState | null>(null);

  // useEffect(() => {
  //   try {
  //     const savedStateJSON = localStorage.getItem(COURSE_STORAGE_KEY);
  //     if (savedStateJSON) setSavedCourse(JSON.parse(savedStateJSON));
  //   } catch (error) {
  //     console.error("Failed to parse saved course from localStorage", error);
  //   }
  // }, []);
  // MODIFIED: Load *everything* from IndexedDB on startup
  useEffect(() => {
    const loadData = async () => {
      // Load materials (your existing code)
      const allMaterials = await db.materials.toArray();
      setStudyMaterials(allMaterials);

      // REPLACED: localStorage.getItem()
      const saved = await db.savedCourses.get(1); // Get the course with id 1
      if (saved) {
        setSavedCourse(saved.session);
      }
    };
    
    loadData();
  }, []); // Runs once on load

  /*useEffect(() => {
    if (currentTest?.mode === 'course') {
      localStorage.setItem(COURSE_STORAGE_KEY, JSON.stringify(currentTest));
    }
  }, [currentTest]);
  */

  const showNotification = (message: string, type: NotificationState['type'] = 'error') => {
    setNotification({ message, type });
  };

  // MODIFIED: Save course progress to IndexedDB
  useEffect(() => {
    const saveProgress = async () => {
      if (currentTest?.mode === 'course') {
        // REPLACED: localStorage.setItem()
        // .put() will add OR update the item with id 1
        await db.savedCourses.put({ id: 1, session: currentTest });
      }
    };
    saveProgress();
  }, [currentTest]);

  // MODIFIED: handleFileSelect now adds to IndexedDB
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;
    let filesAddedCount = 0;
    const newMaterialsList: StudyMaterial[] = [];
    for (const file of files) {
      const name = file.name.replace(/\.json$/, '');
      // Check if it already exists in the DB
      const existing = await db.materials.get(name);
      if (existing) {
        showNotification(`Material "${name}" is already loaded.`, 'info');
        continue;
      }
      // ... (your existing try/catch block)
      try {
        const content = await file.text();
        const questions: Question[] = JSON.parse(content);
        // ... (your validation)
        const newMaterial = { name, questions };
        // Add to our database
        await db.materials.add(newMaterial); 
        newMaterialsList.push(newMaterial);
        filesAddedCount++;
      } catch (error) {
        showNotification(`Error in "${file.name}": ${(error as Error).message}`);
      }
    }
    if (filesAddedCount > 0) {
      // Add the new materials to the *existing* state
      setStudyMaterials(prev => [...prev, ...newMaterialsList]);
      showNotification(`${filesAddedCount} material(s) loaded successfully.`, 'success');
    }
    event.target.value = '';
  };
  /*
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) return;

    const newMaterials = [...studyMaterials];
    let filesAddedCount = 0;

    for (const file of files) {
      const name = file.name.replace(/\.json$/, '');
      if (newMaterials.some(m => m.name === name)) {
        showNotification(`Material "${name}" is already loaded.`, 'info');
        continue;
      }

      try {
        const content = await file.text();
        const questions: Question[] = JSON.parse(content);
        if (!Array.isArray(questions) || !questions.every(q => q.hasOwnProperty('q') && q.hasOwnProperty('a'))) {
          throw new Error("Invalid format.");
        }
        newMaterials.push({ name, questions });
        filesAddedCount++;
      } catch (error) {
        showNotification(`Error in "${file.name}": ${(error as Error).message}`);
      }
    }

    if (filesAddedCount > 0) {
      setStudyMaterials(newMaterials);
      showNotification(`${filesAddedCount} material(s) loaded successfully.`, 'success');
    }
    event.target.value = '';
  };
  */
  // MODIFIED: handleDeleteMaterial now deletes from IndexedDB
  const handleDeleteMaterial = async (nameToDelete: string) => {
    // Delete from the database
    await db.materials.delete(nameToDelete);
    // Remove from React state
    setStudyMaterials(prev => prev.filter(m => m.name !== nameToDelete));
    setSelectedMaterials(prev => prev.filter(name => name !== nameToDelete));
  };
  /*
  const handleDeleteMaterial = (nameToDelete: string) => {
    setStudyMaterials(prev => prev.filter(m => m.name !== nameToDelete));
    setSelectedMaterials(prev => prev.filter(name => name !== nameToDelete));
  };
  */
  const handleToggleMaterial = (name: string) => {
    setSelectedMaterials(prev => prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]);
  };
  
  const getSelectedQuestions = (): Question[] | null => {
    if (selectedMaterials.length === 0) {
      showNotification("Please select at least one study material.");
      return null;
    }
    return studyMaterials
      .filter(m => selectedMaterials.includes(m.name))
      .flatMap(m => m.questions);
  };
  
  const startTest = (numQuestions: number) => {
    const allSelected = getSelectedQuestions();
    if (!allSelected) return;

    const questionCount = Math.min(numQuestions, allSelected.length);
    if(numQuestions > allSelected.length) {
      showNotification(`Only ${allSelected.length} questions available.`, 'info');
    }

    const testQuestions = shuffleArray(allSelected).slice(0, questionCount);
    setCurrentTest({ questions: testQuestions, currentIndex: 0, mode: 'test' });
    setView('test');
  };
  
  const startCourse = () => {
    const allSelected = getSelectedQuestions();
    if (!allSelected) return;
    clearCourseProgress();
    setCurrentTest({ questions: shuffleArray(allSelected), currentIndex: 0, mode: 'course' });
    setView('test');
  };

  const handleNextQuestion = () => {
    if (currentTest && currentTest.currentIndex + 1 < currentTest.questions.length) {
      setCurrentTest(prev => prev ? { ...prev, currentIndex: prev.currentIndex + 1 } : null);
    } else {
      if (currentTest?.mode === 'course') clearCourseProgress();
      setView('results');
    }
  };
  
  const clearCourseProgress = async () => { // Make it async
    // REPLACED: localStorage.removeItem()
    await db.savedCourses.delete(1); // Delete the course with id 1
    setSavedCourse(null);
  };

  const handleResumeCourse = () => {
    if(savedCourse) {
        setCurrentTest(savedCourse);
        setView('test');
    }
  };
  
  const handleEndTest = async () => { // Make it async
    setView('setup');
    // REPLACED: localStorage.getItem()
    const saved = await db.savedCourses.get(1);
    setSavedCourse(saved ? saved.session : null);
  };
  
  const renderView = () => {
    switch (view) {
      case 'test':
        return currentTest && <TestView test={currentTest} onNextQuestion={handleNextQuestion} onEndTest={handleEndTest} />;
      case 'results':
        return <ResultsView completedCount={currentTest?.questions.length ?? 0} onBackToMain={handleEndTest} />;
      case 'setup':
      default:
        return (
          <SetupView
            onStartTest={startTest}
            onStartCourse={startCourse}
            savedCourse={savedCourse}
            onResumeCourse={handleResumeCourse}
            onDiscardCourse={() => {
              clearCourseProgress();
              showNotification("Saved progress discarded.", 'success');
            }}
          />
        );
    }
  };

  return (
    <>
      <Notification notification={notification} onClear={() => setNotification(null)} />
      <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50 text-gray-800">
        <Sidebar
          materials={studyMaterials}
          selectedMaterials={selectedMaterials}
          onFileSelect={handleFileSelect}
          onDeleteMaterial={handleDeleteMaterial}
          onToggleMaterial={handleToggleMaterial}
        />
        <main className="w-full lg:w-2/3 xl:w-3/4 p-6 flex items-center justify-center">
          {renderView()}
        </main>
      </div>
    </>
  );
}