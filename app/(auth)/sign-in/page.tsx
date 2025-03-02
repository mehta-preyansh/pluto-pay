import AuthForm from '@/components/ui/AuthForm'
import React from 'react'

const SignIn = () => {
  return (
    <section className='flex-center w-full h-screen overflow-y-auto max-sm:px-6'>
      <AuthForm type = "sign-in"/>
    </section>
  )
}

export default SignIn