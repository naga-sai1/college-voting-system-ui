
import { ArrowRight, ShieldCheck, Users } from 'lucide-react'
import { Button } from '@/components/custom/button'
import { Card } from '@/components/ui/card'
import { Link } from 'react-router-dom'

export default function Choose() {
  return (
    <div className='relative min-h-screen w-full overflow-hidden bg-[#0A0F1C]'>
      {/* Animated background gradients */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -left-[20%] -top-[40%] h-[70%] w-[70%] animate-pulse rounded-full bg-gradient-to-r from-violet-600/30 to-purple-600/30 blur-3xl' />
        <div className='absolute -bottom-[40%] -right-[20%] h-[70%] w-[70%] animate-pulse rounded-full bg-gradient-to-r from-blue-600/30 to-cyan-600/30 blur-3xl delay-1000' />
      </div>

      {/* Content */}
      <div className='container relative mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-4 py-16'>
        <div className='mb-16 space-y-4 text-center'>
          <h1 className='bg-gradient-to-r from-violet-400 to-cyan-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl lg:text-7xl mb-4'>
            Voter Management System
          </h1>
          <p className='mx-auto max-w-2xl text-lg text-gray-400 md:text-xl mt-auto'>
            Secure, transparent, and efficient electoral process management
            platform
          </p>
        </div>

        <div className='mx-auto grid w-full max-w-4xl gap-8 md:grid-cols-2'>
          {/* Admin Card */}
          <Card className='group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl'>
            <div className='absolute inset-0 bg-gradient-to-br from-violet-600/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
            <div className='relative p-8'>
              <div className='mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-violet-500/20'>
                <ShieldCheck className='h-6 w-6 text-violet-400' />
              </div>
              <h2 className='mb-2 text-2xl font-semibold text-white transition-colors group-hover:text-violet-400'>
                Admin Portal
              </h2>
              <p className='mb-6 text-gray-400'>
                Manage electoral processes, monitor voting activities, and
                ensure system integrity
              </p>
              <Button
                asChild
                className='group/btn border-0 bg-violet-500 text-white hover:bg-violet-600'
              >
                <Link to='/admin-login'>
                  Access Admin
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1' />
                </Link>
              </Button>
            </div>
          </Card>

          {/* Voter Card */}
          <Card className='group relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl'>
            <div className='absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100' />
            <div className='relative p-8'>
              <div className='mb-6 flex h-12 w-12 items-center justify-center rounded-lg bg-cyan-500/20'>
                <Users className='h-6 w-6 text-cyan-400' />
              </div>
              <h2 className='mb-2 text-2xl font-semibold text-white transition-colors group-hover:text-cyan-400'>
                Voter Portal
              </h2>
              <p className='mb-6 text-gray-400'>
                Cast your vote securely and track your voting status in
                real-time
              </p>
              <Button
                asChild
                className='group/btn border-0 bg-cyan-500 text-white hover:bg-cyan-600'
              >
                <Link to='/voter-login'>
                  Access Voting
                  <ArrowRight className='ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1' />
                </Link>
              </Button>
            </div>
          </Card>
        </div>

        {/* Footer */}
        <div className='mt-16 text-center'>
          <p className='text-gray-500'>
            Powered by advanced blockchain technology for maximum security
          </p>
        </div>
      </div>
    </div>
  )
}
