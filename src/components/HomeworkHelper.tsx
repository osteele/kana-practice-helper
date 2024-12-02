'use client'

import { useState } from 'react'
import { FileUpload } from './FileUpload'
import { FeedbackDisplay } from './FeedbackDisplay'
import { ApiKeyInput } from './ApiKeyInput'
import { analyzeImage } from '../services/openai'
import type { ApiResponse } from '../types/kana'

export default function HomeworkHelper() {
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<ApiResponse['feedback'] | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [words, setWords] = useState<string[]>([])
  const [needsApiKey, setNeedsApiKey] = useState(() => !localStorage.getItem('openai-api-key'))
  const [pendingFile, setPendingFile] = useState<File | null>(null)

  const handleApiKeySet = () => {
    setNeedsApiKey(false)
    if (pendingFile) {
      handleFileSelect(pendingFile)
      setPendingFile(null)
    }
  }

  const handleFileSelect = async (file: File) => {
    try {
      setLoading(true)
      setError(null)
      
      // Create preview URL for the selected image
      setSelectedImage(URL.createObjectURL(file))

      // Check for API key
      const apiKey = localStorage.getItem('openai-api-key')
      if (!apiKey) {
        setPendingFile(file)
        setNeedsApiKey(true)
        return
      }

      // Send to OpenAI
      const result = await analyzeImage(file, apiKey)
      setFeedback(result.feedback)
      setWords(result.words)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
      setFeedback(null)
      setWords([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Kana Homework Helper</h1>
          <p className="mt-2 text-gray-600">
            Upload your kana homework for instant feedback and practice suggestions
          </p>
        </div>

        {needsApiKey ? (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-semibold">OpenAI API Key Required</h2>
            <p className="mb-4 text-gray-600">
              Please enter your OpenAI API key to analyze your homework.
            </p>
            <ApiKeyInput onApiKeySet={handleApiKeySet} />
          </div>
        ) : (
          <FileUpload onFileSelect={handleFileSelect} />
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {loading && (
          <div className="text-center">
            <p className="text-gray-600">Analyzing your homework...</p>
          </div>
        )}

        {feedback && (
          <div className="space-y-6">
            <FeedbackDisplay feedback={feedback} />
            {words.length > 0 && (
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold">Words Found</h2>
                <ul className="list-inside list-disc space-y-2">
                  {words.map((word, index) => (
                    <li key={index} className="text-gray-700">{word}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
