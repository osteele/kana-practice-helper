'use client'

import { ChangeEvent, useState } from 'react'
import { Upload } from 'lucide-react'

interface FileUploadProps {
  onFileSelect: (file: File) => void
}

export function FileUpload({ onFileSelect }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    } 
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileSelect(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      onFileSelect(e.target.files[0])
    }
  }

  return (
    <div
      className={`relative rounded-lg border-2 border-dashed p-8 text-center ${
        dragActive ? "border-primary bg-primary/10" : "border-gray-300"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        title="Upload a file"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        onChange={handleChange}
        accept="image/*"
      />
      <div className="flex flex-col items-center gap-2">
        <Upload className="h-8 w-8 text-gray-500" />
        <p className="text-sm text-gray-500">
          Drag and drop your kana homework image, or click to select
        </p>
      </div>
    </div>
  )
}

