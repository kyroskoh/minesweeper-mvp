'use client';

import React from 'react';

export default function ColorReference() {
  const numberColors = [
    { number: 1, color: 'text-blue-600', name: 'Blue' },
    { number: 2, color: 'text-green-600', name: 'Green' },
    { number: 3, color: 'text-red-600', name: 'Red' },
    { number: 4, color: 'text-purple-700', name: 'Purple' },
    { number: 5, color: 'text-yellow-700', name: 'Brown' },
    { number: 6, color: 'text-pink-600', name: 'Pink' },
    { number: 7, color: 'text-black', name: 'Black' },
    { number: 8, color: 'text-gray-600', name: 'Gray' },
  ];

  return (
    <div className="mt-6 p-4 bg-white border rounded-lg shadow-sm">
      <h3 className="font-semibold text-gray-800 mb-3 text-center">Number Colors Reference</h3>
      <div className="grid grid-cols-4 gap-3 max-w-md mx-auto">
        {numberColors.map(({ number, color, name }) => (
          <div key={number} className="text-center">
            <div className={`w-8 h-8 bg-gray-200 border border-gray-300 flex items-center justify-center font-bold text-sm ${color} mx-auto`}>
              {number}
            </div>
            <div className="text-xs text-gray-500 mt-1">{name}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 text-center">
        <div className="flex items-center justify-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 border"></div>
            <span className="text-gray-600">Mine</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-100 border flex items-center justify-center text-xs">🚩</div>
            <span className="text-gray-600">Flag</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-gray-300 border" style={{
              boxShadow: 'inset 1px 1px 0px rgba(255,255,255,0.8), inset -1px -1px 0px rgba(0,0,0,0.3)'
            }}></div>
            <span className="text-gray-600">Hidden</span>
          </div>
        </div>
      </div>
    </div>
  );
}