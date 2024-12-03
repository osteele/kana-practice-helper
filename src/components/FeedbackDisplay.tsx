import { useState } from 'react';

// Utility function to get unique characters from strings
function extractUniqueKana(words: string[]): string[] {
  const kanaSet = new Set<string>();
  words.forEach(word => {
    // Split the word into individual characters
    [...word].forEach(char => kanaSet.add(char));
  });
  return Array.from(kanaSet);
}

interface FeedbackDisplayProps {
  imageUrl?: string;
  feedback: {
    generalFeedback: string;
    kanaRomanizationMismatches: Array<{
      kana: string;
      romanization: string;
      correction: string;
      explanation: string;
    }>;
    sampleWordsAndSentences: string[];
    mnemonicDevices?: string[];
    visualPatterns?: string[];
    kanaWords: string[];
    followUpExercises: string[];
    gojuonAreas: string;
    learningGoals: string[];
  } | null;
}

export function FeedbackDisplay({ feedback, imageUrl }: FeedbackDisplayProps) {
  if (!feedback) return null;

  const [activeTab, setActiveTab] = useState('feedback');

  const tabs = [
    { id: 'homework', label: 'Homework Page' },
    { id: 'feedback', label: 'Feedback' },
    { id: 'exercises', label: 'Practice Exercises' },
  ];

  return (
    <div className="rounded-lg bg-white p-6 shadow space-y-6">
      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                ${activeTab === tab.id
                  ? tab.id === 'exercises'
                    ? 'border-yellow-500 text-yellow-600'
                    : tab.id === 'homework'
                      ? 'border-green-500 text-green-600'
                      : 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'homework' ? (
        <div className="space-y-6">
          {imageUrl && (
            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-900">Submitted Homework</h2>
              <div className="rounded-lg overflow-hidden border border-green-100">
                <img src={imageUrl} alt="Submitted homework" className="w-full h-auto" />
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-900">Learning Goals</h2>
            <ul className="list-disc list-inside space-y-2">
              {feedback.learningGoals.map((goal, index) => (
                <li key={index} className="text-gray-700">{goal}</li>
              ))}
            </ul>
          </section>

          {feedback.kanaWords.filter(word => word.length > 1).length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3 text-green-900">Words Found</h2>
              <div className="flex flex-wrap gap-2">
                {feedback.kanaWords
                  .filter(word => word.length > 1)
                  .map((word, index) => (
                    <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full">
                      {word}
                    </span>
                  ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-xl font-semibold mb-3 text-green-900">Kana Used</h2>
            <div className="flex flex-wrap gap-2">
              {extractUniqueKana(feedback.kanaWords).map((kana, index) => (
                <span key={index} className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-lg">
                  {kana}
                </span>
              ))}
            </div>
          </section>
        </div>
      ) : activeTab === 'feedback' ? (
        <>
          <section>
            <h2 className="text-xl font-semibold mb-3">General Feedback</h2>
            <p className="text-gray-700">{feedback.generalFeedback}</p>
          </section>

          {feedback.kanaRomanizationMismatches.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Corrections</h2>
              <div className="space-y-4">
                {feedback.kanaRomanizationMismatches.map((mismatch, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg font-medium">{mismatch.kana}</span>
                      <span className="text-red-500 line-through">{mismatch.romanization}</span>
                      <span className="text-green-600">→ {mismatch.correction}</span>
                    </div>
                    <p className="text-gray-700">{mismatch.explanation}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {feedback.sampleWordsAndSentences.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Example Usage</h2>
              <ul className="list-disc list-inside space-y-2">
                {feedback.sampleWordsAndSentences.map((example, index) => (
                  <li key={index} className="text-gray-700">{example}</li>
                ))}
              </ul>
            </section>
          )}

          {feedback.mnemonicDevices && feedback.mnemonicDevices.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Memory Aids</h2>
              <ul className="list-disc list-inside space-y-2">
                {feedback.mnemonicDevices.map((mnemonic, index) => (
                  <li key={index} className="text-gray-700">{mnemonic}</li>
                ))}
              </ul>
            </section>
          )}

          {feedback.visualPatterns && feedback.visualPatterns.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Visual Patterns</h2>
              <ul className="list-disc list-inside space-y-2">
                {feedback.visualPatterns.map((pattern, index) => (
                  <li key={index} className="text-gray-700">{pattern}</li>
                ))}
              </ul>
            </section>
          )}
        </>
      ) : (
        feedback.followUpExercises && feedback.followUpExercises.length > 0 && (
          <section className="relative bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
            {/* Paper texture */}
            <div className="absolute inset-0 bg-gradient-to-b from-yellow-50/50 to-transparent pointer-events-none" />
            
            {/* Grid lines */}
            <div className="absolute inset-0 grid grid-cols-[1fr,1fr] gap-px pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="border-r border-yellow-100" />
              ))}
            </div>
            <div className="absolute inset-0 grid grid-rows-[repeat(20,1fr)] gap-px pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div key={i} className="border-b border-yellow-100" />
              ))}
            </div>

            {/* Content */}
            <div className="relative">
              {/* Title section with decorative border */}
              <div className="p-6 border-b border-yellow-100 bg-gradient-to-r from-yellow-50/50 to-white">
                <h2 className="text-xl font-semibold text-yellow-900 flex items-center gap-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full" />
                  Practice Exercises
                </h2>
              </div>

              {/* Exercises */}
              <div className="p-6 space-y-6">
                {feedback.followUpExercises.map((exercise, index) => (
                  <div key={index} className="flex items-start gap-4 relative">
                    {/* Exercise number */}
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow-50 flex items-center justify-center">
                      <span className="text-yellow-600 font-medium">{index + 1}</span>
                    </div>

                    {/* Exercise content */}
                    <div className="flex-grow">
                      <p className="text-gray-700 leading-relaxed">{exercise}</p>
                    </div>

                    {/* Decorative corner fold */}
                    {index === 0 && (
                      <div className="absolute -top-1 -right-1 w-12 h-12 bg-gradient-to-br from-yellow-50 to-white shadow-sm transform rotate-45 translate-x-6 -translate-y-6" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )
      )}
    </div>
  );
}
