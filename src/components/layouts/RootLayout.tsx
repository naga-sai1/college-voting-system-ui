import { VoterProvider } from '@/context/VoterContext'
import { Outlet } from 'react-router-dom'

export function RootLayout() {
  return (
    <VoterProvider>
      <Outlet />
    </VoterProvider>
  )
} 