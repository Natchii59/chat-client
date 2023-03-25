import React, { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { FaSpinner } from 'react-icons/fa'

export type ButtonType = 'primary' | 'secondary' | 'success' | 'danger'
export type ButtonSize = 'xs' | 'sm' | 'base' | 'lg' | 'xl'
export type HeadlessuiMode =
  | 'open'
  | 'checked'
  | 'selected'
  | 'active'
  | 'disabled'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonType?: ButtonType
  buttonSize?: ButtonSize
  uppercase?: boolean
  widthFull?: boolean
  square?: boolean
  isLoading?: boolean
  icon?: React.ReactNode
  headlessuiMode?: HeadlessuiMode
}

const getHeadlessuiModeClassName = (mode: HeadlessuiMode): string[] => {
  switch (mode) {
    case 'open':
      return [
        'ui-open:transform',
        'ui-open:translate-y-1',
        'ui-open:shadow-none'
      ]
    case 'checked':
      return [
        'ui-checked:transform',
        'ui-checked:translate-y-1',
        'ui-checked:shadow-none'
      ]
    case 'selected':
      return [
        'ui-selected:transform',
        'ui-selected:translate-y-1',
        'ui-selected:shadow-none'
      ]
    case 'active':
      return [
        'ui-active:transform',
        'ui-active:translate-y-1',
        'ui-active:shadow-none'
      ]
    case 'disabled':
      return [
        'ui-disabled:transform',
        'ui-disabled:translate-y-1',
        'ui-disabled:shadow-none'
      ]
    default:
      return []
  }
}

const getHeadlessuiModeColorClassName = (
  mode: HeadlessuiMode,
  type?: ButtonType
): string[] => {
  switch (mode) {
    case 'open':
      switch (type) {
        case 'primary':
          return ['ui-open:bg-blue-450']
        case 'secondary':
          return ['ui-open:bg-zinc-200', 'dark:ui-open:bg-zinc-700']
        case 'success':
          return ['ui-open:bg-green-450']
        case 'danger':
          return ['ui-open:bg-red-450']
        default:
          return ['ui-open:bg-zinc-200', 'dark:ui-open:bg-zinc-700']
      }
    case 'checked':
      switch (type) {
        case 'primary':
          return ['ui-checked:bg-blue-450']
        case 'secondary':
          return ['ui-checked:bg-zinc-200', 'dark:ui-checked:bg-zinc-700']
        case 'success':
          return ['ui-checked:bg-green-450']
        case 'danger':
          return ['ui-checked:bg-red-450']
        default:
          return ['ui-checked:bg-zinc-200', 'dark:ui-checked:bg-zinc-700']
      }
    case 'selected':
      switch (type) {
        case 'primary':
          return ['ui-selected:bg-blue-450']
        case 'secondary':
          return ['ui-selected:bg-zinc-200', 'dark:ui-selected:bg-zinc-700']
        case 'success':
          return ['ui-selected:bg-green-450']
        case 'danger':
          return ['ui-selected:bg-red-450']
        default:
          return ['ui-selected:bg-zinc-200', 'dark:ui-selected:bg-zinc-700']
      }
    case 'active':
      switch (type) {
        case 'primary':
          return ['ui-active:bg-blue-450']
        case 'secondary':
          return ['ui-active:bg-zinc-200', 'dark:ui-active:bg-zinc-700']
        case 'success':
          return ['ui-active:bg-green-450']
        case 'danger':
          return ['ui-active:bg-red-450']
        default:
          return ['ui-active:bg-zinc-200', 'dark:ui-active:bg-zinc-700']
      }
    case 'disabled':
      switch (type) {
        case 'primary':
          return ['ui-disabled:bg-blue-400']
        case 'secondary':
          return ['ui-disabled:bg-zinc-100', 'dark:ui-disabled:bg-zinc-800']
        case 'success':
          return ['ui-disabled:bg-green-400']
        case 'danger':
          return ['ui-disabled:bg-red-400']
        default:
          return ['ui-disabled:bg-zinc-100', 'dark:ui-disabled:bg-zinc-800']
      }
    default:
      return []
  }
}

const Button = React.forwardRef(
  (
    {
      buttonType,
      buttonSize,
      uppercase,
      widthFull,
      square,
      isLoading,
      icon,
      headlessuiMode,
      className,
      disabled,
      children,
      ...props
    }: ButtonProps & PropsWithChildren,
    ref: React.Ref<HTMLButtonElement>
  ) => {
    const getClassName: () => string = () => {
      const customClassName = [
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
      ]

      switch (buttonType) {
        case 'primary':
          customClassName.push('bg-blue-400')
          customClassName.push('hover:bg-blue-450')
          customClassName.push('disabled:hover:bg-blue-400')
          customClassName.push('focus-visible:bg-blue-450')
          customClassName.push('text-zinc-50')
          customClassName.push('border-blue-500')
          customClassName.push('shadow-blue-500')
          break
        case 'secondary':
          customClassName.push('bg-zinc-100')
          customClassName.push('dark:bg-zinc-800')
          customClassName.push('hover:bg-zinc-200')
          customClassName.push('dark:hover:bg-zinc-700')
          customClassName.push('disabled:hover:bg-zinc-100')
          customClassName.push('dark:disabled:hover:bg-zinc-800')
          customClassName.push('focus-visible:bg-zinc-200')
          customClassName.push('dark:focus-visible:bg-zinc-700')
          customClassName.push('text-blue-400')
          customClassName.push('border-zinc-300')
          customClassName.push('dark:border-zinc-600')
          customClassName.push('shadow-zinc-300')
          customClassName.push('dark:shadow-zinc-600')
          break
        case 'success':
          customClassName.push('bg-green-400')
          customClassName.push('hover:bg-green-450')
          customClassName.push('disabled:hover:bg-green-400')
          customClassName.push('focus-visible:bg-green-450')
          customClassName.push('text-zinc-50')
          customClassName.push('border-green-500')
          customClassName.push('shadow-green-500')
          break
        case 'danger':
          customClassName.push('bg-red-400')
          customClassName.push('hover:bg-red-450')
          customClassName.push('disabled:hover:bg-red-400')
          customClassName.push('focus-visible:bg-red-450')
          customClassName.push('text-zinc-50')
          customClassName.push('border-red-500')
          customClassName.push('shadow-red-500')
          break
        default:
          customClassName.push('bg-zinc-100')
          customClassName.push('dark:bg-zinc-800')
          customClassName.push('hover:bg-zinc-200')
          customClassName.push('dark:hover:bg-zinc-700')
          customClassName.push('disabled:hover:bg-zinc-100')
          customClassName.push('dark:disabled:hover:bg-zinc-800')
          customClassName.push('focus-visible:bg-zinc-200')
          customClassName.push('dark:focus-visible:bg-zinc-700')
          customClassName.push('text-blue-400')
          customClassName.push('border-zinc-300')
          customClassName.push('dark:border-zinc-600')
          customClassName.push('shadow-zinc-300')
          customClassName.push('dark:shadow-zinc-600')
      }

      switch (buttonSize) {
        case 'xs':
          customClassName.push('text-xs')
          if (square) {
            customClassName.push('px-2')
            customClassName.push('py-2')
          } else {
            customClassName.push('px-2')
            customClassName.push('py-1')
          }
          break
        case 'sm':
          customClassName.push('text-sm')
          if (square) {
            customClassName.push('px-2')
            customClassName.push('py-2')
          } else {
            customClassName.push('px-3')
            customClassName.push('py-1.5')
          }
          break
        case 'base':
          customClassName.push('text-base')
          if (square) {
            customClassName.push('px-2')
            customClassName.push('py-2')
          } else {
            customClassName.push('px-4')
            customClassName.push('py-2')
          }
          break
        case 'lg':
          customClassName.push('text-lg')
          if (square) {
            customClassName.push('px-2')
            customClassName.push('py-2')
          } else {
            customClassName.push('px-4')
            customClassName.push('py-2')
          }
          break
        case 'xl':
          customClassName.push('text-xl')
          if (square) {
            customClassName.push('px-2')
            customClassName.push('py-2')
          } else {
            customClassName.push('px-4')
            customClassName.push('py-2')
          }
          break
        default:
          customClassName.push('text-base')
          if (square) {
            customClassName.push('px-2')
            customClassName.push('py-2')
          } else {
            customClassName.push('px-4')
            customClassName.push('py-2')
          }
      }

      if (uppercase) customClassName.push('uppercase')

      if (widthFull) customClassName.push('w-full')

      if (headlessuiMode) {
        customClassName.push(...getHeadlessuiModeClassName(headlessuiMode))
        customClassName.push(
          ...getHeadlessuiModeColorClassName(headlessuiMode, buttonType)
        )
      }

      if (className) customClassName.push(...className.split(/[\s,]+/))

      return customClassName.join(' ')
    }

    return (
      <button
        {...props}
        ref={ref}
        disabled={isLoading || disabled}
        className={getClassName()}
      >
        {isLoading ? <FaSpinner className='animate-spin ' /> : icon}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'
Button.defaultProps = {
  buttonType: 'secondary',
  buttonSize: 'base',
  uppercase: false,
  widthFull: false,
  square: false,
  isLoading: false
}

export default Button
