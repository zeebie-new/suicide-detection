import React, { useState, useEffect } from 'react';
import { AlertTriangle, Heart, MessageCircle, Phone, Activity } from 'lucide-react';

const CrisisPrevention = () => {
  const [userInput, setUserInput] = useState('');
  const [moodScore, setMoodScore] = useState(5);
  const [riskLevel, setRiskLevel] = useState('low');
  const [entries, setEntries] = useState([]);
  const [showIntervention, setShowIntervention] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  // Crisis indicators - keywords that suggest high risk
  const crisisKeywords = [
    'end it all', 'no point', 'goodbye', 'last time', 'nobody cares',
    'kill myself', 'suicide', 'die', 'hopeless', 'worthless',
    'can\'t go on', 'tired of living', 'want to disappear'
  ];

  const hopelessnessKeywords = [
    'nothing matters', 'no future', 'pointless', 'give up',
    'no hope', 'forever', 'always', 'never get better'
  ];

  const isolationKeywords = [
    'alone', 'nobody understands', 'no friends', 'isolated',
    'abandoned', 'rejected', 'invisible'
  ];

  // Analyze text for risk factors
  const analyzeText = (text) => {
    const lowerText = text.toLowerCase();
    let riskScore = 0;
    let flags = [];

    // Check for crisis keywords
    crisisKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        riskScore += 10;
        flags.push(`Crisis language: "${keyword}"`);
      }
    });

    // Check for hopelessness
    hopelessnessKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        riskScore += 5;
        flags.push(`Hopelessness indicator: "${keyword}"`);
      }
    });

    // Check for isolation
    isolationKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        riskScore += 3;
        flags.push(`Isolation indicator: "${keyword}"`);
      }
    });

    // Combine with mood score
    if (moodScore <= 3) riskScore += 5;
    if (moodScore <= 2) riskScore += 10;

    // Determine risk level
    let level = 'low';
    if (riskScore >= 20) level = 'critical';
    else if (riskScore >= 10) level = 'high';
    else if (riskScore >= 5) level = 'medium';

    return { score: riskScore, level, flags };
  };

  const handleSubmit = () => {
    if (!userInput.trim()) return;

    const analysis = analyzeText(userInput);
    const newEntry = {
      id: Date.now(),
      text: userInput,
      mood: moodScore,
      timestamp: new Date().toLocaleString(),
      riskScore: analysis.score,
      riskLevel: analysis.level,
      flags: analysis.flags
    };

    setEntries(prev => [newEntry, ...prev]);
    setAnalysisResult(analysis);
    setRiskLevel(analysis.level);

    // Trigger intervention for high risk
    if (analysis.level === 'critical' || analysis.level === 'high') {
      setShowIntervention(true);
    }

    setUserInput('');
  };

  const InterventionModal = () => {
    if (!showIntervention) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4">
          <div className="flex items-center mb-4">
            <Heart className="text-red-500 mr-2" size={24} />
            <h3 className="text-lg font-semibold">We're here for you</h3>
          </div>
          
          <p className="mb-4 text-gray-700">
            It seems like you might be going through a really tough time. You're not alone, and there are people who want to help.
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center p-3 bg-blue-50 rounded">
              <Phone className="text-blue-600 mr-3" size={20} />
              <div>
                <p className="font-medium">Crisis Hotline</p>
                <p className="text-sm text-gray-600">988 (US) or your local emergency number</p>
              </div>
            </div>
            
            <div className="flex items-center p-3 bg-green-50 rounded">
              <MessageCircle className="text-green-600 mr-3" size={20} />
              <div>
                <p className="font-medium">Text Support</p>
                <p className="text-sm text-gray-600">Text HOME to 741741</p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex gap-2">
            <button 
              onClick={() => setShowIntervention(false)}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              I'll reach out for help
            </button>
            <button 
              onClick={() => setShowIntervention(false)}
              className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
            >
              Maybe later
            </button>
          </div>
        </div>
      </div>
    );
  };

  const getRiskColor = (level) => {
    switch(level) {
      case 'critical': return 'text-red-600 bg-red-50';
      case 'high': return 'text-orange-600 bg-orange-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-green-600 bg-green-50';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4 flex items-center">
          <Activity className="mr-2 text-blue-600" />
          Crisis Prevention AI System
        </h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Input Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">How are you feeling today?</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Mood Scale (1-10): {moodScore}
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={moodScore}
                onChange={(e) => setMoodScore(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Very Low</span>
                <span>Very High</span>
              </div>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">
                Share your thoughts:
              </label>
              <textarea
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Write about how you're feeling, what's on your mind..."
                className="w-full p-3 border rounded-lg h-32 resize-none"
              />
            </div>
            
            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Submit Entry
            </button>
          </div>
          
          {/* Analysis Section */}
          <div>
            <h2 className="text-lg font-semibold mb-4">Current Analysis</h2>
            
            {analysisResult ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg ${getRiskColor(analysisResult.level)}`}>
                  <div className="flex items-center mb-2">
                    <AlertTriangle size={20} className="mr-2" />
                    <span className="font-medium">Risk Level: {analysisResult.level.toUpperCase()}</span>
                  </div>
                  <p className="text-sm">Risk Score: {analysisResult.score}</p>
                </div>
                
                {analysisResult.flags.length > 0 && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Detected Indicators:</h4>
                    <ul className="text-sm space-y-1">
                      {analysisResult.flags.map((flag, index) => (
                        <li key={index} className="text-gray-700">• {flag}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Submit an entry to see analysis</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Entry History */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Recent Entries</h2>
        
        {entries.length === 0 ? (
          <p className="text-gray-500">No entries yet</p>
        ) : (
          <div className="space-y-4">
            {entries.slice(0, 5).map((entry) => (
              <div key={entry.id} className="border-l-4 border-blue-200 pl-4 py-2">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-sm text-gray-500">{entry.timestamp}</span>
                  <span className={`text-xs px-2 py-1 rounded ${getRiskColor(entry.riskLevel)}`}>
                    {entry.riskLevel}
                  </span>
                </div>
                <p className="text-gray-800 mb-1">{entry.text}</p>
                <p className="text-sm text-gray-600">Mood: {entry.mood}/10</p>
              </div>
            ))}
          </div>
        )}
      </div>
      
      <InterventionModal />
    </div>
  );
};

export default CrisisPrevention;
