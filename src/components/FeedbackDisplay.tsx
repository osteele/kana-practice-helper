interface FeedbackDisplayProps {
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
    words: string[];
    followUpExercises: string[];
  } | null;
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  if (!feedback) return null;

  return (
    <div className="rounded-lg bg-white p-6 shadow space-y-6">
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

      {feedback.words.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3">Words Found</h2>
          <div className="flex flex-wrap gap-2">
            {feedback.words.map((word, index) => (
              <span key={index} className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                {word}
              </span>
            ))}
          </div>
        </section>
      )}

      {feedback.followUpExercises && feedback.followUpExercises.length > 0 && (
        <section className="relative bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden">
          {/* Paper texture */}
          <div className="absolute inset-0 bg-gradient-to-b from-gray-50/50 to-transparent pointer-events-none" />
          
          {/* Grid lines */}
          <div className="absolute inset-0 grid grid-cols-[1fr,1fr] gap-px pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="border-r border-gray-100" />
            ))}
          </div>
          <div className="absolute inset-0 grid grid-rows-[repeat(20,1fr)] gap-px pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div key={i} className="border-b border-gray-100" />
            ))}
          </div>

          {/* Content */}
          <div className="relative">
            {/* Title section with decorative border */}
            <div className="p-6 border-b border-indigo-100 bg-gradient-to-r from-indigo-50/50 to-white">
              <h2 className="text-xl font-semibold text-indigo-900 flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-400 rounded-full" />
                Practice Exercises
              </h2>
            </div>

            {/* Exercises */}
            <div className="p-6 space-y-6">
              {feedback.followUpExercises.map((exercise, index) => (
                <div key={index} className="flex items-start gap-4 relative">
                  {/* Exercise number */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center">
                    <span className="text-indigo-600 font-medium">{index + 1}</span>
                  </div>

                  {/* Exercise content */}
                  <div className="flex-grow">
                    <p className="text-gray-700 leading-relaxed">{exercise}</p>
                  </div>

                  {/* Decorative corner fold */}
                  {index === 0 && (
                    <div className="absolute -top-1 -right-1 w-12 h-12 bg-gradient-to-br from-gray-50 to-white shadow-sm transform rotate-45 translate-x-6 -translate-y-6" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
