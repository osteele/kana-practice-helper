export interface KanaAnalysis {
  hiragana: boolean
  katakana: boolean
  columns: string[]
  characters: string[]
}

export interface HomeworkFeedback {
  feedback: string
  followUpExercise: string
  practiceWords: string[]
}

export interface ApiResponse {
  feedback: string
  words: string[]
}
