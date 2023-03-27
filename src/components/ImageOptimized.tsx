import { useRef, useState } from 'react'
import { Blurhash } from 'react-blurhash'

interface ImageOptimizedProps {
  src: string
  blurhash: string
  width: number
  height?: number
  alt: string
  classNamePosition?: string
  classNameStyle?: string
}

function ImageOptimized({
  src,
  blurhash,
  width,
  height,
  alt,
  classNamePosition,
  classNameStyle
}: ImageOptimizedProps) {
  const [loading, setLoading] = useState<boolean>(true)

  const ref = useRef<HTMLImageElement>(null)

  const onLoaded = () => {
    setLoading(false)
  }

  const onError = () => {
    setLoading(false)
    if (ref.current) ref.current.src = '/default_profile_picture.webp'
  }

  return (
    <div className={classNamePosition}>
      <div className='relative'>
        {loading ? (
          <Blurhash
            hash={blurhash}
            width={width}
            height={height ?? width}
            resolutionX={32}
            resolutionY={32}
            punch={1}
            className={`absolute top-0 left-0 z-10 ${
              classNameStyle?.includes('rounded-full')
                ? '[&>canvas]:rounded-full'
                : null
            }`}
          />
        ) : null}
        <img
          ref={ref}
          src={src}
          alt={alt}
          loading='lazy'
          onLoad={onLoaded}
          onError={onError}
          width={width}
          height={height ?? width}
          className={`absolute top-0 left-0 z-10 ${classNameStyle}`}
        />
      </div>
    </div>
  )
}

export default ImageOptimized
