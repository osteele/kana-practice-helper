'use client'

import { useState, useEffect } from 'react'
import { FileUpload } from './FileUpload'
import { FeedbackDisplay } from './FeedbackDisplay'
import { ApiKeyInput } from './ApiKeyInput'
import { analyzeImage } from '../services/openai'
import type { HomeworkFeedback } from '../services/openai'
import { MarkdownContent } from './MarkdownContent'
import { Header } from './Header'
import homeDescription from '../content/home-description.md'

const kanaCharacters = ['あ', 'い', 'う', 'え', 'お', 'か', 'き', 'く', 'け', 'こ']

const loadingPhrases = [
  "Looking at each character carefully...",
  "Checking stroke order and balance...",
  "Comparing with reference kana...",
  "Finding similar characters to practice...",
  "Preparing helpful examples...",
  "Creating practice exercises...",
  "Looking for learning patterns..."
]

const LoadingAnimation = () => {
  const [currentChar, setCurrentChar] = useState(0)
  const [currentPhrase, setCurrentPhrase] = useState(0)

  // Update character and phrase
  useEffect(() => {
    const charInterval = setInterval(() => {
      setCurrentChar((prev) => (prev + 1) % kanaCharacters.length)
    }, 500)

    const phraseInterval = setInterval(() => {
      setCurrentPhrase((prev) => (prev + 1) % loadingPhrases.length)
    }, 2000)

    return () => {
      clearInterval(charInterval)
      clearInterval(phraseInterval)
    }
  }, [])

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-6">
      <div className="relative">
        {/* Ink drop effect */}
        <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-20" />

        {/* Writing paper effect */}
        <div className="relative w-32 h-32 bg-white rounded-lg shadow-lg border-2 border-gray-200 flex items-center justify-center">
          {/* Grid lines like Japanese writing paper */}
          <div className="absolute inset-0 grid grid-cols-2 gap-4 p-2 pointer-events-none">
            <div className="border-r border-gray-200" />
            <div className="border-l border-gray-200" />
          </div>

          {/* Animated kana character */}
          <span className="text-6xl text-indigo-600 animate-bounce">
            {kanaCharacters[currentChar]}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center space-y-2">
        <p className="text-lg font-medium text-gray-700">Analyzing your homework...</p>
        <p className="text-sm text-gray-500 italic min-h-[1.5rem] transition-opacity duration-300">
          {loadingPhrases[currentPhrase]}
        </p>
      </div>
    </div>
  )
}

export default function HomeworkHelper() {
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<HomeworkFeedback | null>(null)
  const [_selectedImage, setSelectedImage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
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
      setFeedback(null)

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
      setFeedback(result)
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'An error occurred')
      setFeedback(null)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="p-8">
        <div className="mx-auto max-w-3xl space-y-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold flex items-center justify-center gap-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-10 h-10 text-indigo-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.4 2.245 4.5 4.5 0 0 0 8.4-2.245c0-.399-.078-.78-.22-1.128Zm0 0a15.998 15.998 0 0 0 3.388-1.62m-5.043-.025a15.994 15.994 0 0 1 1.622-3.395m3.42 3.42a15.995 15.995 0 0 0 4.764-4.648l3.876-5.814a1.151 1.151 0 0 0-1.597-1.597L14.146 6.32a15.996 15.996 0 0 0-4.649 4.763m3.42 3.42a6.776 6.776 0 0 0-3.42-3.42"
                />
              </svg>
              Kana Practice Helper
            </h1>
            <div className={`mt-4 max-w-2xl mx-auto overflow-hidden transition-all duration-300 ease-in-out ${!loading && !feedback ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}>
              <div className="bg-indigo-50 rounded-lg p-4 mb-6">
                <MarkdownContent
                  content={homeDescription}
                  className="text-left text-sm"
                />
              </div>
            </div>
          </div>

          {needsApiKey ? (
            <div className="rounded-lg bg-white p-6 shadow">
              <h2 className="mb-4 text-xl font-semibold">OpenAI API Key Required</h2>
              <p className="mb-4 text-gray-600">
                Please enter your OpenAI API key to analyze your homework.
                The key will only be stored in your browser and sent directly to OpenAI's servers.
              </p>
              <p className="mb-4 text-sm text-gray-500">
                Don't have an API key?{' '}
                <a
                  href="https://platform.openai.com/api-keys"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 hover:text-indigo-500 underline"
                >
                  Get one from OpenAI
                </a>
              </p>
              <ApiKeyInput onApiKeySet={handleApiKeySet} />
            </div>
          ) : (
            <>
              <p className="text-lg text-gray-600 font-medium">
                Upload your kana homework for feedback and practice suggestions.
              </p>
              <FileUpload onFileSelect={handleFileSelect} />
            </>
          )}

          {error && (
            <div className="rounded-md bg-red-50 p-4">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {loading && <LoadingAnimation />}

          {!loading && feedback && (
            <div className="space-y-6">
              <FeedbackDisplay feedback={feedback} />
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
