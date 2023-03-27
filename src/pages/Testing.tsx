import { useState } from 'react'

import { useUpdateUserMutation } from '@/stores/user/userApiSlice'

export function Testing() {
  const [file, setFile] = useState<File | null>(null)

  const [updateUser] = useUpdateUserMutation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const { data, errors } = await updateUser({
      input: {
        avatar: file
      }
    }).unwrap()

    console.log('data', data)
    console.log('errors', errors)
  }

  return (
    <form onSubmit={handleSubmit}>
      <input type='file' onChange={handleFileChange} />

      <button type='submit'>Submit</button>
    </form>
  )
}

export default Testing
