import React from 'react';
import TodoList from './components/Todo';
import WeatherApp from './components/Weather';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold text-center">Personal Dashboard</h1>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Todo Module */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-2" id="todo-container">
              <TodoList />
            </div>
          </div>
          
          {/* Weather Module */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-2" id="weather-container">
              <WeatherApp />
            </div>
          </div>
          
          {/* Notes Module */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden h-full">
            <div className="p-2 h-full" id="notes-container">
              {/* Notes module will be injected via JavaScript */}
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-400">Loading notes...</div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-gray-200 py-4 text-center text-gray-600 text-sm mt-auto">
        <p>Personal Dashboard PWA</p>
      </footer>
    </div>
  );
};

export default App;