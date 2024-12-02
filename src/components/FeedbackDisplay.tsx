import ReactMarkdown from 'react-markdown';

interface FeedbackDisplayProps {
  feedback: string;
}

const markdownComponents = {
  // Style headers
  h1: ({ children }: { children: React.ReactNode }) => (
    <h1 className="text-2xl font-bold mb-4">{children}</h1>
  ),
  h2: ({ children }: { children: React.ReactNode }) => (
    <h2 className="text-xl font-semibold mb-3 mt-6">{children}</h2>
  ),
  h3: ({ children }: { children: React.ReactNode }) => (
    <h3 className="text-lg font-medium mb-2 mt-4">{children}</h3>
  ),
  // Style lists
  ul: ({ children }: { children: React.ReactNode }) => (
    <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
  ),
  ol: ({ children }: { children: React.ReactNode }) => (
    <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
  ),
  // Style paragraphs
  p: ({ children }: { children: React.ReactNode }) => (
    <p className="mb-4 leading-relaxed">{children}</p>
  ),
  // Style emphasis
  em: ({ children }: { children: React.ReactNode }) => (
    <em className="italic">{children}</em>
  ),
  strong: ({ children }: { children: React.ReactNode }) => (
    <strong className="font-semibold">{children}</strong>
  ),
};

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Feedback</h2>
      <div className="text-gray-700">
        <ReactMarkdown components={markdownComponents}>{feedback}</ReactMarkdown>
      </div>
    </div>
  );
}
