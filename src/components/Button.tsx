import {
  ButtonHTMLAttributes,
  PropsWithChildren,
  useEffect,
  useState
} from 'react'

export type ButtonType = 'primary' | 'secondary' | 'success' | 'danger'
export type ButtonSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: ButtonType
  buttonSize?: ButtonSize
  uppercase?: boolean
  selected?: boolean
}

function Button({
  children,
  buttonType,
  buttonSize,
  uppercase,
  selected,
  ...rest
}: ButtonProps & PropsWithChildren) {
  const [className, setClassName] = useState<string[]>([])

  const addClass = (className: string) => {
    setClassName(prevState => [...prevState, className])
  }

  useEffect(() => {
    setClassName([
      'font-bold',
      'rounded-xl',
      'border-2',
      'shadow-[0_4px_0]',
      'active:shadow-none',
      'active:transform',
      'active:translate-y-1',
      'disabled:shadow-none',
      'disabled:transform',
      'disabled:translate-y-1',
      'disabled:cursor-not-allowed',
      'outline-none',
      'flex',
      'items-center',
      'justify-center',
      'gap-2',
      'mb-1'
    ])

    switch (buttonType) {
      case 'primary':
        addClass('bg-blue-400')
        addClass('hover:bg-blue-400')
        addClass('focus:bg-blue-400')
        addClass('text-zinc-50')
        addClass('border-blue-500')
        addClass('shadow-blue-500')
        break
      case 'secondary':
        if (selected) {
          addClass('bg-zinc-200')
          addClass('dark:bg-zinc-700')
        } else {
          addClass('bg-zinc-100')
          addClass('dark:bg-zinc-800')
          addClass('hover:bg-zinc-200')
          addClass('dark:hover:bg-zinc-700')
          addClass('focus:bg-zinc-200')
          addClass('dark:focus:bg-zinc-700')
        }
        addClass('text-blue-400')
        addClass('border-zinc-300')
        addClass('dark:border-zinc-600')
        addClass('shadow-zinc-300')
        addClass('dark:shadow-zinc-600')
        break
      case 'success':
        addClass('bg-green-400')
        addClass('hover:bg-green-400')
        addClass('focus:bg-green-400')
        addClass('text-zinc-50')
        addClass('border-green-500')
        addClass('shadow-green-500')
        break
      case 'danger':
        addClass('bg-red-400')
        addClass('hover:bg-red-400')
        addClass('focus:bg-red-400')
        addClass('text-zinc-50')
        addClass('border-red-500')
        addClass('shadow-red-500')
        break
      default:
        if (selected) {
          addClass('bg-zinc-200')
          addClass('dark:bg-zinc-700')
        } else {
          addClass('bg-zinc-100')
          addClass('dark:bg-zinc-800')
          addClass('hover:bg-zinc-200')
          addClass('dark:hover:bg-zinc-700')
          addClass('focus:bg-zinc-200')
          addClass('dark:focus:bg-zinc-700')
        }
        addClass('text-blue-400')
        addClass('border-zinc-300')
        addClass('dark:border-zinc-600')
        addClass('shadow-zinc-300')
        addClass('dark:shadow-zinc-600')
    }

    switch (buttonSize) {
      case 'xs':
        addClass('text-xs')
        addClass('px-2')
        addClass('py-1')
        break
      case 'sm':
        addClass('text-sm')
        addClass('px-2')
        addClass('py-1.5')
        break
      case 'base':
        addClass('text-base')
        addClass('px-4')
        addClass('py-2')
        break
      case 'lg':
        addClass('text-lg')
        addClass('px-4')
        addClass('py-2')
        break

      case 'xl':
        addClass('text-xl')
        addClass('px-4')
        addClass('py-2')
        break
      default:
        addClass('text-base')
        addClass('px-4')
        addClass('py-2')
    }

    if (uppercase) addClass('uppercase')

    return () => {
      setClassName([])
    }
  }, [buttonType, buttonSize, uppercase, selected])

  return (
    <button {...rest} className={className.join(' ')}>
      {children}
    </button>
  )
}

export default Button
