type CaseTransform = 'capitalize' | 'uppercase' | 'lowercase' | 'original'

const transformCase = (text: string, transform: CaseTransform): string => {
  switch (transform) {
    case 'capitalize':
      return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
    case 'uppercase':
      return text.toUpperCase()
    case 'lowercase':
      return text.toLowerCase()
    case 'original':
    default:
      return text
  }
}

export { transformCase, type CaseTransform }