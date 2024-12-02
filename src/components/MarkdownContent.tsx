import ReactMarkdown from 'react-markdown'

interface MarkdownContentProps {
  content: string
  className?: string
}

export function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  return (
    <div className={`prose prose-indigo max-w-none [&>ul]:space-y-1 [&>p]:mb-3 [&>ul]:mt-2 
      [&>h1]:text-sm [&>h1]:font-bold [&>h1]:italic [&>h1]:mt-0 [&>h1]:mb-3 ${className}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
