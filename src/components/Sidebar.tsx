import React from 'react';
import  type {StudyMaterial} from '../types.ts';

interface SidebarProps {
  materials: StudyMaterial[];
  selectedMaterials: string[];
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDeleteMaterial: (name: string) => void;
  onToggleMaterial: (name: string) => void;
}

export default function Sidebar({ materials, selectedMaterials, onFileSelect, onDeleteMaterial, onToggleMaterial }: SidebarProps) {
  return (
    <aside className="w-full lg:w-1/3 xl:w-1/4 p-6 bg-white border-[1.5pt] border-black flex flex-col"> 
      <div className='my-4'></div>
      <h1 className="text-2xl text-gray-900 mb-1  font-mono ">
        <div className='text-4xl text-blue-500'><img src="/my-logo.png" alt="P4P Logo" className="h-14   bg-black rounded-full p-1 mb-4 mx-4"/>@plan<span className='text-red-500'>4</span>prepp.</div> </h1>
      <p className="text-gray-500 font-mono mb-6">Load, select, and test your knowledge.</p>

      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-2 "><span className=' text-2xl text-blue-500'>Load </span>Study Files JSON</h2>
        <input
          type="file"
          accept=".json"
          multiple
          onChange={onFileSelect}
          className="block w-full text-sm font-mono border-black border-[1.5pt] text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer"
        />
        <a href="#" target="_blank" rel="noopener noreferrer" className="font-mono block mt-2 text-sm text-indigo-600 hover:underline">
          Guide: How to prepare your JSON with AI
        </a>
      </div>

      <div className="flex-grow flex flex-col min-h-0">
        <h2 className="text-lg font-semibold mb-2"><span className='text-blue-500 text-2xl'>Select  </span>Materials</h2>
        <div className="flex-grow space-y-2 overflow-y-auto pr-2 border-t pt-2">
          {materials.length === 0 ? (
            <p className="text-gray-500 font-mono">No materials loaded yet.</p>
          ) : (
            materials.map((material) => (
              <div key={material.name} className="material-item flex items-center justify-between p-2 rounded-md transition-colors">
                <div className="flex items-center">
                  <input
                    id={material.name}
                    type="checkbox"
                    checked={selectedMaterials.includes(material.name)}
                    onChange={() => onToggleMaterial(material.name)}
                    className="h-4 w-4 text-indigo-600 border-black border-2 rounded focus:blue-500"
                  />
                  <label htmlFor={material.name} className="ml-3 block text-sm font-medium text-gray-700 font-mono">
                    {material.name} ({material.questions.length} Qs)
                  </label>
                </div>
                <button
                  onClick={() => onDeleteMaterial(material.name)}
                  className="text-red-500 hover:text-red-700 font-bold text-lg"
                  aria-label={`Delete ${material.name}`}
                >
                  &times;
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </aside>
  );
}