interface FeedbackDisplayProps {
  feedback: string
}

export function FeedbackDisplay({ feedback }: FeedbackDisplayProps) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <h2 className="mb-4 text-xl font-semibold">Feedback</h2>
      <p className="whitespace-pre-wrap text-gray-700">{feedback}</p>
    </div>
  )
}
