//@ts-nocheck
import type React from 'react'

import { useState } from 'react'
import { ShieldCheck, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/custom/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { verifyOtp } from '@/api'
import { useVoter } from '@/context/VoterContext'

export default function OtpVerification() {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useVoter()
  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

    // Focus next input
    if (element.nextSibling && element.value !== '') {
      ;(element.nextSibling as HTMLInputElement).focus()
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    const enteredOtp = otp.join('')
    const voter = JSON.parse(localStorage.getItem('voter') || '{}')
    try {
      // Calling verifyOtp from api with a fixed phone_no; you can update this as needed.
      const response = await verifyOtp({
        phone_no: voter.phone_no,
        otp: enteredOtp,
      })

      // Store voter and blockchainInfo from the response in localStorage
      localStorage.setItem('voter', JSON.stringify(response.voter))
      localStorage.setItem(
        'blockchainInfo',
        JSON.stringify(response.blockchainInfo)
      )

      // Handle success (e.g., navigating to poll voting page)
      console.log('OTP verified successfully:', response)
      navigate('/voter-polling')
    } catch (err: any) {
      console.error('OTP verification failed:', err)
      setError(err.message || 'OTP verification failed. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className='flex min-h-screen items-center justify-center bg-[#0A0F1C] p-8'>
      <div className='w-full max-w-md space-y-8 rounded-2xl bg-white/5 p-8 backdrop-blur-sm'>
        <div className='flex items-center justify-between'>
          <Button
            variant='ghost'
            className='text-gray-400 hover:bg-white/10 hover:text-white'
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className='mr-2 h-4 w-4' />
            Back
          </Button>
        </div>

        <div className='space-y-2'>
          <h1 className='text-3xl font-bold text-white'>OTP Verification</h1>
          <p className='text-gray-400'>
            Enter the 6-digit code sent to your phone
          </p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-6'>
          <div className='space-y-2'>
            <Label htmlFor='otp' className='text-gray-200'>
              Enter OTP
            </Label>
            <div className='flex gap-2'>
              {otp.map((data, index) => (
                <Input
                  key={index}
                  type='text'
                  maxLength={1}
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  className='h-12 w-12 border-white/20 bg-white/10 text-center text-2xl text-white'
                  required
                />
              ))}
            </div>
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
                Verify OTP
              </span>
            )}
          </Button>
        </form>

        <p className='text-center text-sm text-gray-400'>
          Didn't receive the code?{' '}
          <button className='text-cyan-400 underline hover:text-cyan-300'>
            Resend OTP
          </button>
        </p>
      </div>
    </div>
  )
}
