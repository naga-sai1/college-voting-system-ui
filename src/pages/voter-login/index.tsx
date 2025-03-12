//@ts-nocheck
import { useState } from 'react'
import { Users, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link, useNavigate } from 'react-router-dom'
import { loginVoter } from '@/api'
import { useVoter } from '@/context/VoterContext'

export default function VoterLogin() {
  const [aadhar, setAadhar] = useState('')
  const [phone, setPhone] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const { login } = useVoter()
  const navigate = useNavigate()
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const formattedAadhar = aadhar.replace(/\s/g, ' ')
      const response = await loginVoter({
        aadhar: formattedAadhar,
        phone_no: phone,
      })

      localStorage.setItem(
        'voter',
        JSON.stringify({ aadhar: formattedAadhar, phone_no: phone })
      )

      console.log('Login successful:', response)
      navigate('/otp-verification')
    } catch (err: any) {
      setError(
        err.message === 'Blockchain verification failed'
          ? 'Security verification failed. Please try again.'
          : 'Invalid credentials. Please check your Aadhar and phone number.'
      )
      console.error('Login failed:', err)
    } finally {
      setIsLoading(false)
    }
  }

  // Format Aadhar number as user types (XXXX XXXX XXXX)
  const handleAadharChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '') // Remove non-digits
    const formattedValue =
      value
        .match(/.{1,4}/g)
        ?.join(' ')
        .substr(0, 14) || ''
    setAadhar(formattedValue)
  }

  // Format phone number as user types
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substr(0, 10)
    setPhone(value)
  }

  return (
    <div className='grid min-h-screen bg-[#0A0F1C] lg:grid-cols-2'>
      {/* Left side */}
      <div className='relative hidden flex-col items-center justify-center bg-black lg:flex'>
        <div className='absolute inset-0'>
          <div className='absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-transparent' />
        </div>

        <div className='relative z-10 flex flex-col items-center space-y-8'>
          <div className='h-64 w-64 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-400 to-purple-400 p-[2px]'>
            <div className='flex h-full w-full items-center justify-center rounded-xl bg-black'>
              <Users className='h-32 w-32 text-white' />
            </div>
          </div>
          <blockquote className='max-w-md text-center text-lg text-white/80'>
            "Exercise your democratic right with our secure and efficient voting
            platform."
          </blockquote>
        </div>

        <div className='absolute left-12 top-12 flex items-center gap-2'>
          <Users className='h-8 w-8 text-cyan-400' />
          <span className='text-xl font-semibold text-white'>Voter Portal</span>
        </div>
      </div>

      {/* Right side */}
      <div className='flex items-center justify-center bg-gradient-to-br from-gray-900 to-black p-8'>
        <div className='w-full max-w-md space-y-8 rounded-2xl bg-white/5 p-8 backdrop-blur-sm'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2 lg:hidden'>
              <Users className='h-8 w-8 text-cyan-400' />
              <span className='text-xl font-semibold text-white'>
                Voter Portal
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
            <h1 className='text-3xl font-bold text-white'>Voter Login</h1>
            <p className='text-gray-400'>
              Enter your Aadhar number and phone number to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='aadhar' className='text-gray-200'>
                Aadhar Number
              </Label>
              <Input
                id='aadhar'
                type='text'
                value={aadhar}
                onChange={handleAadharChange}
                placeholder='XXXX XXXX XXXX'
                className='border-white/20 bg-white/10 text-white placeholder:text-gray-500'
                required
              />
            </div>

            <div className='space-y-2'>
              <Label htmlFor='phone' className='text-gray-200'>
                Phone Number
              </Label>
              <Input
                id='phone'
                type='tel'
                value={phone}
                onChange={handlePhoneChange}
                placeholder='Enter your phone number'
                className='border-white/20 bg-white/10 text-white placeholder:text-gray-500'
                required
              />
            </div>

            {error && (
              <div className='flex items-center gap-2 rounded-lg bg-red-500/10 p-3'>
                <p className='text-center text-sm text-red-400'>{error}</p>
              </div>
            )}

            <Button
              type='submit'
              className='w-full bg-cyan-600 text-white hover:bg-cyan-700'
              disabled={isLoading}
            >
              {isLoading ? (
                'Verifying...'
              ) : (
                <span className='flex items-center gap-2'>
                  <ShieldCheck className='h-4 w-4' />
                  Secure Login
                </span>
              )}
            </Button>
          </form>

          <p className='text-center text-sm text-gray-400'>
            By clicking login, you agree to our{' '}
            <Link
              to='#'
              className='text-cyan-400 underline hover:text-cyan-300'
            >
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link
              to='#'
              className='text-cyan-400 underline hover:text-cyan-300'
            >
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
