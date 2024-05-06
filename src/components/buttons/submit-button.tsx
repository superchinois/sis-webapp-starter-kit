'use client'
 
import { useFormStatus } from 'react-dom'
 
export function SubmitButton() {
  const { pending } = useFormStatus()
 
  return (
    <button className="px-4 py-2 font-bold text-white bg-blue-500 rounded" type="submit" disabled={pending}>
      Get
    </button>
  )
}