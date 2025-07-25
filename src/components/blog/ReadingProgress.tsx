import { useState, useEffect } from 'react'

interface ReadingProgressProps {
  target: React.RefObject<HTMLElement>
}

export function ReadingProgress({ target }: ReadingProgressProps) {
  const [readingProgress, setReadingProgress] = useState(0)

  useEffect(() => {
    const targetElement = target.current
    if (!targetElement) return

    const updateReadingProgress = () => {
      const element = targetElement
      const totalHeight = element.scrollHeight - element.clientHeight
      const windowScrollTop = window.scrollY

      if (windowScrollTop === 0) {
        return setReadingProgress(0)
      }

      if (windowScrollTop > totalHeight) {
        return setReadingProgress(100)
      }

      setReadingProgress((windowScrollTop / totalHeight) * 100)
    }

    window.addEventListener('scroll', updateReadingProgress)
    return () => window.removeEventListener('scroll', updateReadingProgress)
  }, [target])

  return (
    <div className="fixed top-0 left-0 w-full h-1 bg-border z-50">
      <div
        className="h-full bg-gradient-to-r from-primary to-accent transition-all duration-150 ease-out"
        style={{ width: `${readingProgress}%` }}
      />
    </div>
  )
}