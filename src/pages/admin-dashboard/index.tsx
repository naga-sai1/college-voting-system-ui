//@ts-nocheck

import { useEffect, useState } from 'react'
import {
  BarChart,
  Users,
  VoteIcon,
  ArrowUpRight,
  ArrowDownRight,
  ChevronDown,
  Plus,
  LogOut,
  Trash2,
} from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/custom/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import { partyWiseVotingCount, resetAllPolls } from '@/api'

// Mock data for demonstration
// const stats = [
//   {
//     title: 'Total Voters',
//     value: 10234,
//     icon: Users,
//     change: 12.5,
//     increasing: true,
//   },
//   {
//     title: 'Total Votes Cast',
//     value: 8756,
//     icon: VoteIcon,
//     change: 8.2,
//     increasing: true,
//   },
//   {
//     title: 'Parties Registered',
//     value: 6,
//     icon: BarChart,
//     change: 0,
//     increasing: false,
//   },
// ]

const partyData = [
  {
    name: 'Party A',
    votes: 3245,
    percentage: 37.06,
    logo: '/placeholder.svg?height=40&width=40',
  },
  {
    name: 'Party B',
    votes: 2890,
    percentage: 33.01,
    logo: '/placeholder.svg?height=40&width=40',
  },
  {
    name: 'Party C',
    votes: 1621,
    percentage: 18.51,
    logo: '/placeholder.svg?height=40&width=40',
  },
  {
    name: 'Party D',
    votes: 680,
    percentage: 7.77,
    logo: '/placeholder.svg?height=40&width=40',
  },
  {
    name: 'Party E',
    votes: 320,
    percentage: 3.65,
    logo: '/placeholder.svg?height=40&width=40',
  },
]

// Add or update the interface for the statistics
interface PartyStatistics {
  id: number
  name: string
  logo: string
  state_id: number
  state_name: string
  votes: number
  percentage: string
}

interface VotingCountResponse {
  message: string
  totalVoters: number
  totalVotesCast: number
  votingPercentage: number
  statistics: PartyStatistics[]
}

export default function AdminDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('This Week')
  const navigate = useNavigate()
  const isAdmin = localStorage.getItem('isAdmin')
  const [votingData, setVotingData] = useState<VotingCountResponse | null>(null)
  const [partyStats, setPartyStats] = useState<any[]>([])
  const [totalVotes, setTotalVotes] = useState(0)
  const [totalVoters, setTotalVoters] = useState(0)
  const [votingPercentage, setVotingPercentage] = useState(0)
  const [showResetConfirmation, setShowResetConfirmation] = useState(false)
  const [isResetting, setIsResetting] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    navigate('/')
  }

  const handleResetPolls = async () => {
    try {
      setIsResetting(true)
      await resetAllPolls()
      // Refresh the data after reset
      const response = await partyWiseVotingCount() as VotingCountResponse
      setVotingData(response)
      setPartyStats(response.statistics)
      setTotalVotes(response.totalVotesCast)
      setTotalVoters(response.totalVoters)
      setVotingPercentage(response.votingPercentage)
    } catch (error) {
      console.error('Error resetting polls:', error)
    } finally {
      setIsResetting(false)
      setShowResetConfirmation(false)
    }
  }

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin-login')
    }
  }, [isAdmin, navigate])

  useEffect(() => {
    const fetchPartyStats = async () => {
      try {
        const response = await partyWiseVotingCount() as VotingCountResponse
        setVotingData(response)
        setPartyStats(response.statistics)
        setTotalVotes(response.totalVotesCast)
        setTotalVoters(response.totalVoters)
        setVotingPercentage(response.votingPercentage)
      } catch (error) {
        console.error('Error fetching party stats:', error)
      }
    }

    fetchPartyStats()
  }, [])

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#1A1F2C] p-8'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-3xl font-bold text-white'>Admin Dashboard</h1>
          <div className='flex items-center gap-4'>
            <Button
              onClick={() => navigate('/conduct-poll')}
              className='bg-cyan-600 text-white hover:bg-cyan-700'
            >
              <VoteIcon className='mr-2 h-4 w-4' />
              Conduct Poll
            </Button>
            <Button
              onClick={() => navigate('/create-parties')}
              className='bg-violet-600 text-white hover:bg-violet-700'
            >
              <Plus className='mr-2 h-4 w-4' />
              Create New Party
            </Button>
            <Button
              onClick={() => navigate('/add-voter')}
              className='bg-green-600 text-white hover:bg-green-700'
            >
              <Plus className='mr-2 h-4 w-4' />
              Add Voter
            </Button>
            <Button
              onClick={() => setShowResetConfirmation(true)}
              variant='outline'
              className='border-red-500/20 text-red-500 hover:bg-red-500/10'
              disabled={isResetting}
            >
              <Trash2 className='mr-2 h-4 w-4' />
              {isResetting ? 'Resetting...' : 'Reset All Polls'}
            </Button>
            <Button
              onClick={handleLogout}
              variant='outline'
              className='border-red-500/20 text-red-500 hover:bg-red-500/10'
            >
              <LogOut className='mr-2 h-4 w-4' />
              Logout
            </Button>
          </div>
        </div>

        <AlertDialog open={showResetConfirmation} onOpenChange={setShowResetConfirmation}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Reset All Polls</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to reset all polls? This action cannot be undone.
                All voting data will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={isResetting}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleResetPolls}
                disabled={isResetting}
                className="bg-red-500 text-white hover:bg-red-600"
              >
                {isResetting ? 'Resetting...' : 'Reset All'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className='mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Voters
              </CardTitle>
              <Users className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {votingData?.totalVoters || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Total Votes Cast
              </CardTitle>
              <VoteIcon className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {votingData?.totalVotesCast || 0}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                Voting Percentage
              </CardTitle>
              <ArrowUpRight className='h-4 w-4 text-muted-foreground' />
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>
                {votingData?.votingPercentage || '0.00'}%
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className='border-white/20 bg-white/5'>
          <CardHeader>
            <CardTitle className='text-xl font-bold text-white'>
              Party-wise Voting Count
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Party Name</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Votes</TableHead>
                  <TableHead>Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {votingData?.statistics.map((party) => (
                  <TableRow key={party.id}>
                    <TableCell className='font-medium'>{party.name}</TableCell>
                    <TableCell>{party.state_name}</TableCell>
                    <TableCell>{party.votes}</TableCell>
                    <TableCell>{party.percentage}%</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
