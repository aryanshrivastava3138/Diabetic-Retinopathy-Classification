import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Eye, BookOpen, AlertTriangle, Activity, Home } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  
  const navItems = [
    { path: '/', label: 'Detection Tool', icon: Eye },
    { path: '/about-diabetes', label: 'About Diabetes', icon: BookOpen },
    { path: '/causes-effects', label: 'Causes & Effects', icon: AlertTriangle },
    { path: '/types', label: 'Types of Diabetes', icon: Activity },
  ];

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Eye className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Diabetic Retinopathy Center</h1>
              <p className="text-sm text-gray-600">AI-powered detection & education</p>
            </div>
          </div>
          
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;