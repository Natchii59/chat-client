import { InputHTMLAttributes, useState } from 'react'
import { FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa'

import { ErrorMessage } from '@/utils/types'

interface InputFormProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string
  label: string
  loading?: boolean
  success?: boolean
  error?: ErrorMessage
  inputSize?: 'xs' | 'sm' | 'base'
}

function InputForm({
  name,
  label,
  loading,
  success,
  error,
  inputSize,
  disabled,
  ...rest
}: InputFormProps) {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  return (
    <div>
      <label
        htmlFor={name}
        className={`font-semibold ${
          error ? 'text-red-500' : success ? 'text-green-500' : 'text-zinc-400'
        } ${
          inputSize === 'xs'
            ? 'text-xs'
            : inputSize === 'sm'
            ? 'text-sm'
            : inputSize === 'base'
            ? 'text-base'
            : 'text-base'
        }`}
      >
        {label}
      </label>

      <div className='relative'>
        <input
          {...rest}
          type={showPassword ? 'text' : rest.type}
          id={name}
          disabled={loading || disabled}
          aria-describedby={`${name}-error`}
          className={`w-full bg-zinc-100 dark:bg-zinc-800 rounded-xl border-2 focus:outline-none focus:ring-0 peer disabled:cursor-not-allowed focus:invalid:border-red-500 dark:focus:invalid:border-red-500 disabled:opacity-70 ${
            error
              ? 'border-red-500'
              : success
              ? 'border-green-500'
              : 'border-zinc-300 dark:border-zinc-600 focus:border-blue-500 dark:focus:border-blue-500'
          } ${(loading || rest.type === 'password') && 'pr-12'} ${
            rest.maxLength && 'pr-20'
          } ${
            inputSize === 'xs'
              ? 'text-xs p-1.5'
              : inputSize === 'sm'
              ? 'text-sm p-2'
              : inputSize === 'base'
              ? 'text-base p-2.5'
              : 'text-base p-2.5'
          }`}
        />

        {loading && (
          <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
            <FaSpinner
              className={`text-zinc-400 animate-spin ${
                inputSize === 'xs'
                  ? 'w-4 h-4'
                  : inputSize === 'sm'
                  ? 'w-5 h-5'
                  : inputSize === 'base'
                  ? 'w-6 h-6'
                  : 'w-6 h-6'
              }`}
            />
          </div>
        )}

        {rest.maxLength && rest.type === 'text' && (
          <p className='absolute right-3 top-1/2 transform -translate-y-1/2 text-base text-zinc-400'>
            {(rest.value as string).length || 0}/{rest.maxLength}
          </p>
        )}

        {rest.type === 'password' && !loading && (
          <button
            type='button'
            className='absolute right-3 top-1/2 transform -translate-y-1/2 outline-none text-zinc-400 focus:text-zinc-500 dark:focus:text-zinc-300 hover:text-zinc-500 dark:hover:text-zinc-300'
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <FaEyeSlash className='w-5 h-5 text-inherit' />
            ) : (
              <FaEye className='w-5 h-5 text-inherit' />
            )}
          </button>
        )}
      </div>

      {!!error && error.message && (
        <p
          id={`${name}-error`}
          className='mt-2 text-sm text-red-500 font-medium'
        >
          {error.message}
        </p>
      )}
    </div>
  )
}

export default InputForm
