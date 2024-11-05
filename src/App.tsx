import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Plus, Trash2, Check, X, FolderHeart, Coffee, Briefcase, Home, Bike } from 'lucide-react';

type Category = {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
};

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  category: string;
  createdAt: Date;
};

const categories: Category[] = [
  { id: 'all', name: 'All Tasks', icon: <Coffee className="w-5 h-5" />, color: 'bg-purple-500' },
  { id: 'work', name: 'Work', icon: <Briefcase className="w-5 h-5" />, color: 'bg-blue-500' },
  { id: 'personal', name: 'Personal', icon: <FolderHeart className="w-5 h-5" />, color: 'bg-pink-500' },
  { id: 'home', name: 'Home', icon: <Home className="w-5 h-5" />, color: 'bg-green-500' },
  { id: 'errands', name: 'Errands', icon: <Bike className="w-5 h-5" />, color: 'bg-orange-500' },
];

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      return JSON.parse(saved).map((todo: any) => ({
        ...todo,
        createdAt: new Date(todo.createdAt)
      }));
    }
    return [];
  });
  const [newTodo, setNewTodo] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodo.trim()) return;

    setTodos([
      ...todos,
      {
        id: crypto.randomUUID(),
        text: newTodo,
        completed: false,
        category: selectedCategory === 'all' ? 'personal' : selectedCategory,
        createdAt: new Date()
      }
    ]);
    setNewTodo('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const filteredTodos = todos
    .filter(todo => selectedCategory === 'all' || todo.category === selectedCategory)
    .filter(todo => todo.text.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-4xl mx-auto p-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">TaskOS</h1>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg ${darkMode ? 'bg-gray-800 text-yellow-400' : 'bg-gray-200 text-gray-600'}`}
          >
            {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
        </div>

        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
            } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
          />
          <Search className="absolute left-3 top-2.5 w-5 h-5 text-gray-400" />
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                selectedCategory === category.id
                ? `${category.color} text-white`
                : darkMode
                  ? 'bg-gray-800 text-gray-300'
                  : 'bg-white text-gray-600'
              }`}
            >
              {category.icon}
              <span className="whitespace-nowrap">{category.name}</span>
            </button>
          ))}
        </div>

        <form onSubmit={addTodo} className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              placeholder="Add a new task..."
              className={`flex-1 px-4 py-2 rounded-lg ${
                darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'
              } border ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}
            />
            <button
              type="submit"
              className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Task
            </button>
          </div>
        </form>

        <div className="space-y-2">
          {filteredTodos.map(todo => (
            <div
              key={todo.id}
              className={`flex items-center gap-4 p-4 rounded-lg transition-all ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } ${todo.completed ? 'opacity-75' : ''}`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  todo.completed
                    ? 'bg-green-500 border-green-500'
                    : darkMode
                    ? 'border-gray-600'
                    : 'border-gray-300'
                }`}
              >
                {todo.completed && <Check className="w-4 h-4 text-white" />}
              </button>
              <span className={`flex-1 ${todo.completed ? 'line-through text-gray-500' : ''}`}>
                {todo.text}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm ${
                categories.find(c => c.id === todo.category)?.color
              } text-white`}>
                {categories.find(c => c.id === todo.category)?.name}
              </span>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
          {filteredTodos.length === 0 && (
            <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
              No tasks found. Add some tasks to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
