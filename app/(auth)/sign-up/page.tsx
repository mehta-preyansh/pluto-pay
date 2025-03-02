import AuthForm from '@/components/ui/AuthForm'
import React from 'react'

const SignUp = () => {
  return (
    <section className='flex-center w-full h-screen overflow-y-auto max-sm:px-6 custom-scrollbar'>
      <AuthForm type = "sign-up"/>
    </section>
  )
}

export default SignUp