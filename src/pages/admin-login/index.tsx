//@ts-nocheck
import { useState } from 'react'

import { ShieldCheck, Github, Facebook, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from 'react-router-dom'

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false)
  const [userId, setUserId] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const navigate = useNavigate()
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setErrorMessage('')

    // Simulated API call
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Dummy validation
      if (userId === 'admin123' && password === 'Admin@123') {
        console.log('Login successful')
        // Redirect or handle success here
        localStorage.setItem('isAdmin', 'true')
        navigate('/admin-dashboard')
      } else {
        throw new Error('Invalid credentials')
      }
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className='grid min-h-screen bg-[#0A0F1C] lg:grid-cols-2'>
      {/* Left side */}
      <div className='relative hidden flex-col items-center justify-center bg-black lg:flex'>
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-violet-600/20 to-transparent' />
        </div>

        <div className='relative z-10 flex flex-col items-center space-y-8'>
          <div className='h-96 w-96 rounded-xl bg-gradient-to-br from-violet-400 via-purple-400 to-cyan-400 p-[2px]'>
            <div className='flex h-full w-full items-center justify-center rounded-xl bg-black'>
              <ShieldCheck className='h-64 w-64 text-white' />
            </div>
          </div>
          <blockquote className='max-w-md text-center text-lg text-white/80'>
            "Secure administrative access for managing electoral processes and
            ensuring system integrity."
          </blockquote>
        </div>

        <div className='absolute left-12 top-12 flex items-center gap-2'>
          <ShieldCheck className='h-8 w-8 text-violet-400' />
          <span className='text-xl font-semibold text-white'>Admin Portal</span>
        </div>
      </div>

      {/* Right side */}
      <div className='flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-8'>
        <div className='w-full max-w-md space-y-8 rounded-2xl bg-white/5 p-8 backdrop-blur-sm'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 lg:hidden'>
              <ShieldCheck className='h-8 w-8 text-violet-400' />
              <span className='text-xl font-semibold text-white'>
                Admin Portal
              </span>
            </div>
            <Button
              variant='ghost'
              className='text-gray-400 hover:bg-white/10 hover:text-white'
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>

          <div className='space-y-2'>
            <h1 className='text-3xl font-bold text-white'>Admin Login</h1>
            <p className='text-gray-400'>
              Enter your credentials to access the admin dashboard
            </p>
          </div>

          <form className='space-y-6' onSubmit={handleSubmit}>
            <div className='space-y-2'>
              <Label htmlFor='userId' className='text-gray-200'>
                User ID
              </Label>
              <Input
                id='userId'
                type='text'
                placeholder='admin@example.com'
                className='border-white/20 bg-white/10 text-white placeholder:text-gray-500'
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
            </div>

            <div className='space-y-2'>
              <div className='flex items-center justify-between'>
                <Label htmlFor='password' className='text-gray-200'>
                  Password
                </Label>
                <Button
                  variant='link'
                  className='px-0 text-violet-400 hover:text-violet-300'
                >
                  Forgot password?
                </Button>
              </div>
              <div className='relative'>
                <Input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  className='border-white/20 bg-white/10 pr-10 text-white'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  className='absolute right-0 top-0 h-full px-3 py-2 text-gray-400 hover:bg-transparent hover:text-white'
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className='h-4 w-4' />
                  ) : (
                    <Eye className='h-4 w-4' />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type='submit'
              className='w-full bg-violet-600 text-white hover:bg-violet-700'
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>

            {errorMessage && (
              <p className='text-center text-sm text-red-400'>{errorMessage}</p>
            )}
          </form>

          <p className='text-center text-sm text-gray-400'>
            By clicking login, you agree to our{' '}
            <Link
              to='/terms'
              className='text-violet-400 underline hover:text-violet-300'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              to='/privacy'
              className='text-violet-400 underline hover:text-violet-300'
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
