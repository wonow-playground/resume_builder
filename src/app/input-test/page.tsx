/**
 * 간단한 입력 테스트 페이지
 * SSR 없이 순수 클라이언트에서 테스트
 */
'use client';

import React, { useState } from 'react';

// useEffect를 import하지 않아서 SSR 문제 방지
export default function InputTestPage() {
  const [inputValue, setInputValue] = useState('');
  const [logs, setLogs] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    setLogs(prev => [...prev, `Changed: "${value}"`]);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setLogs(prev => [...prev, `KeyDown: ${e.key} (${e.keyCode})`]);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    setLogs(prev => [...prev, `KeyPress: ${e.key} (${e.charCode})`]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-8">간단한 입력 테스트</h1>
      
      <div className="max-w-2xl mx-auto space-y-8">
        {/* 기본 입력 필드 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">기본 input 테스트</h2>
          <input
            type="text"
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            placeholder="쉼표와 스페이스바를 입력해보세요"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onKeyPress={handleKeyPress}
          />
          <p className="mt-2 text-sm text-gray-600">현재값: "{inputValue}"</p>
        </div>

        {/* TechStackInput 테스트 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">TechStackInput 테스트</h2>
          <textarea
            className="w-full p-3 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            rows={4}
            placeholder="여기에도 입력 테스트"
            onChange={(e) => {
              const value = e.target.value;
              setLogs(prev => [...prev, `TextArea: "${value}"`]);
            }}
          />
        </div>

        {/* 이벤트 로그 */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">이벤트 로그</h2>
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {logs.slice(-10).reverse().map((log, index) => (
              <div key={index} className="text-sm font-mono bg-gray-100 p-1 rounded">
                {log}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}