import React, { useState } from 'react';
import axios from 'axios';

function DebugPage() {
  const [status, setStatus] = useState('');
  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
  };

  const testHealth = async () => {
    try {
      addLog('Testing health endpoint...');
      const response = await axios.get('http://localhost:5002/api/health');
      addLog('✅ Health check passed: ' + JSON.stringify(response.data));
      setStatus('Connected');
    } catch (error) {
      addLog('❌ Health check failed: ' + error.message);
      setStatus('Error');
    }
  };

  const testDatabase = async () => {
    try {
      addLog('Testing database connection...');
      const response = await axios.get('http://localhost:5002/api/test');
      addLog('✅ Database test passed: ' + JSON.stringify(response.data));
    } catch (error) {
      addLog('❌ Database test failed: ' + error.message);
    }
  };

  const testSignup = async () => {
    try {
      addLog('Testing signup...');
      const response = await axios.post('http://localhost:5002/api/users/signup', {
        username: 'testuser' + Date.now(),
        email: 'test' + Date.now() + '@example.com',
        password: 'TestPass123',
        phone: '9876543210'
      });
      addLog('✅ Signup successful: ' + JSON.stringify(response.data));
    } catch (error) {
      addLog('❌ Signup failed: ' + (error.response?.data?.error || error.message));
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Debug Panel</h1>
      
      <div className="mb-4 p-4 bg-blue-100 rounded">
        <p className="font-semibold">Status: {status}</p>
      </div>

      <div className="space-y-2 mb-6">
        <button onClick={testHealth} className="block w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Test Health
        </button>
        <button onClick={testDatabase} className="block w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
          Test Database
        </button>
        <button onClick={testSignup} className="block w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600">
          Test Signup
        </button>
      </div>

      <div className="bg-gray-100 p-4 rounded max-h-96 overflow-y-auto">
        <h2 className="font-bold mb-2">Logs:</h2>
        {logs.map((log, i) => (
          <div key={i} className="text-sm font-mono mb-1 text-gray-700">
            {log}
          </div>
        ))}
      </div>
    </div>
  );
}

export default DebugPage;
