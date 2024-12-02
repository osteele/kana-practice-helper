import ReactMarkdown from 'react-markdown'
import { useEffect, useState } from 'react'

interface MarkdownContentProps {
  contentPath: string
  className?: string
}

export function MarkdownContent({ contentPath, className = '' }: MarkdownContentProps) {
  const [content, setContent] = useState('')

  useEffect(() => {
    fetch(contentPath)
      .then(response => response.text())
      .then(text => setContent(text))
      .catch(error => console.error('Error loading markdown content:', error))
  }, [contentPath])

  return (
    <div className={`prose prose-indigo max-w-none [&>ul]:space-y-1 [&>p]:mb-3 [&>ul]:mt-2 ${className}`}>
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  )
}
