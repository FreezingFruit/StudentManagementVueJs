/**
 * Simple capitalization function for names
 * @param text - The text to capitalize
 * @returns Properly capitalized text
 */
export function capitalize(text: string): string {
  if (!text) return text

  return text
    .toLowerCase()
    .split(' ')
    .map((word) => {
      if (!word) return word

      if (word.includes('-')) {
        return word
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join('-')
      }

      if (word.includes("'")) {
        return word
          .split("'")
          .map((part, index) => {
            if (index === 0 || part.length > 1) {
              return part.charAt(0).toUpperCase() + part.slice(1)
            }
            return part.toUpperCase()
          })
          .join("'")
      }

      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}
