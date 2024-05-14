'use client'
import React from "react";
import { clsx } from 'clsx';
import { useFormStatus } from 'react-dom'

export type SubmitButtonProps = {
  handleOnClick: () => void;
}

export function SubmitButton() {
  const { pending } = useFormStatus()
  const spinnerClass=clsx(!pending && 'hidden',pending && 'mr-2 h-5 w-5 border-t-transparent border-solid animate-spin rounded-full border-white border-4')
  return (
    <button type="submit" disabled={pending}
    className="bg-indigo-400 h-max w-max rounded-lg text-white font-bold hover:bg-indigo-300 duration-[500ms,800ms]">
        <div className="flex items-center justify-center m-[10px]"> 
            <div className={spinnerClass}></div>
            <div>Get</div>
        </div>
    </button>
  )
}
