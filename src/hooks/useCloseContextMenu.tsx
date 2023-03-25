import { useEffect } from 'react'

interface CloseContextMenuProps {
  id: string
  onHide: () => void
}

export function useCloseContextMenu({ id, onHide }: CloseContextMenuProps) {
  useEffect(() => {
    const handleMouseDown = (e: any) => {
      if (e.target && !e.target.closest(id)) {
        onHide()
      }
    }

    document.addEventListener('mousedown', handleMouseDown)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onHide()
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    const handleResize = () => {
      onHide()
    }

    window.addEventListener('resize', handleResize)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [id, onHide])
}
