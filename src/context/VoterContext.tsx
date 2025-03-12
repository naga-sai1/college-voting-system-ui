import React, { createContext, useContext, useState } from 'react'

interface Voter {
  id: number
  name: string
  aadhar: string
  phone_no: string
  voted_at: string | null
  has_voted: boolean
}

interface BlockchainInfo {
  blockHash: string
  previousHash: string
  timestamp: string
  verificationStatus: string
}

interface VoterContextType {
  voter: Voter | null
  blockchainInfo: BlockchainInfo | null
  login: (voter: Voter, blockchainInfo: BlockchainInfo) => void
  logout: () => void
}

const VoterContext = createContext<VoterContextType | undefined>(undefined)

export function VoterProvider({ children }: { children: React.ReactNode }) {
  const [voter, setVoter] = useState<Voter | null>(null)
  const [blockchainInfo, setBlockchainInfo] = useState<BlockchainInfo | null>(
    null
  )

  const login = (voter: Voter, blockchainInfo: BlockchainInfo) => {
    setVoter(voter)
    setBlockchainInfo(blockchainInfo)
    localStorage.setItem('voter', JSON.stringify(voter))
    localStorage.setItem('blockchainInfo', JSON.stringify(blockchainInfo))
    localStorage.setItem('isVoterLoggedIn', 'true')
  }

  const logout = () => {
    setVoter(null)
    setBlockchainInfo(null)
    localStorage.removeItem('voter')
    localStorage.removeItem('blockchainInfo')
    localStorage.removeItem('isVoterLoggedIn')
  }

  return (
    <VoterContext.Provider value={{ voter, blockchainInfo, login, logout }}>
      {children}
    </VoterContext.Provider>
  )
}

export function useVoter() {
  const context = useContext(VoterContext)
  if (context === undefined) {
    throw new Error('useVoter must be used within a VoterProvider')
  }
  return context
}
