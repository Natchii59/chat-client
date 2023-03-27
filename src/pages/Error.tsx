import { useNavigate } from 'react-router-dom'

import Button from '@/components/Button'

export function Error() {
  const navigate = useNavigate()

  return (
    <div className='absolute inset-0 flex flex-col items-center justify-center gap-4'>
      <h1 className='text-3xl font-extrabold'>An error occurred</h1>

      <Button
        buttonType='primary'
        buttonSize='xl'
        onClick={() => navigate('/', { replace: true })}
      >
        Reload
      </Button>
    </div>
  )
}

export default Error
