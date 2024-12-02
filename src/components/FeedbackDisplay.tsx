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
    </div>
  );
}
