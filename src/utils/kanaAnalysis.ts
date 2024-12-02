const HIRAGANA_REGEX = /[\u3040-\u309F]/
const KATAKANA_REGEX = /[\u30A0-\u30FF]/

const GOJUON_COLUMNS = {
  あ: ['あ', 'い', 'う', 'え', 'お'],
  か: ['か', 'き', 'く', 'け', 'こ'],
  さ: ['さ', 'し', 'す', 'せ', 'そ'],
  た: ['た', 'ち', 'つ', 'て', 'と'],
  な: ['な', 'に', 'ぬ', 'ね', 'の'],
  は: ['は', 'ひ', 'ふ', 'へ', 'ほ'],
  ま: ['ま', 'み', 'む', 'め', 'も'],
  や: ['や', 'ゆ', 'よ'],
  ら: ['ら', 'り', 'る', 'れ', 'ろ'],
  わ: ['わ', 'を', 'ん'],
}

export function getColumnName(char: string): string | null {
  for (const [column, chars] of Object.entries(GOJUON_COLUMNS)) {
    if (chars.includes(char)) {
      return column
    }
  }
  return null
}

export function containsHiragana(text: string): boolean {
  return HIRAGANA_REGEX.test(text)
}

export function containsKatakana(text: string): boolean {
  return KATAKANA_REGEX.test(text)
}

