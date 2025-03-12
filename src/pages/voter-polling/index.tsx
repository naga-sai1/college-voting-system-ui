//@ts-nocheck

import { useEffect, useState } from 'react'
import { Users, Check, Star, Shield, Leaf, Feather, LogOut } from 'lucide-react'
import { Button } from '@/components/custom/button'
import { Card, CardContent } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { SuccessModal } from './components/success-modal'
import { ErrorModal } from './components/error-modal'
import { useNavigate } from 'react-router-dom'
import { getAllPolls, castVote } from '@/api'

interface State {
  id: string
  name: string
  abbreviation: string
}

interface Party {
  party_id: number
  name: string
  abbreviation: string
  logo: string | null
}

interface Poll {
  poll_id: number
  name: string
  start_date: string
  end_date: string
  state: State
  parties: Party[]
}

export default function VoterPolling() {
  const [selectedParty, setSelectedParty] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [polls, setPolls] = useState<Poll[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedPollId, setSelectedPollId] = useState<number | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const voter = localStorage.getItem('voter')
    ? JSON.parse(localStorage.getItem('voter')!)
    : null

  const navigate = useNavigate()

  useEffect(() => {
    if (!voter) {
      navigate('/voter-login')
    }
  }, [voter, navigate])

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        setLoading(true)
        const response = await getAllPolls(voter.state_id)

        // Get polls without filtering
        const polls = response.polls || []
        setPolls(polls)

        // Automatically select the first poll if available
        if (polls.length > 0) {
          setSelectedPollId(polls[0].poll_id)
        }
      } catch (error) {
        console.error('Error fetching polls:', error)
        setErrorMessage('Failed to fetch polls. Please try again.')
        setShowErrorModal(true)
      } finally {
        setLoading(false)
      }
    }

    if (voter) {
      fetchPolls()
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedParty || !voter || !selectedPollId) {
      setErrorMessage('Please select a party to vote')
      setShowErrorModal(true)
      return
    }

    try {
      setSubmitting(true)
      const response = await castVote({
        aadhar: voter.aadhar,
        name: voter.name,
        phone_no: voter.phone_no,
        party_id: parseInt(selectedParty),
      })

      const updatedVoter = {
        ...voter,
        has_voted: true,
      }

      localStorage.setItem('voter', JSON.stringify(updatedVoter))
      setShowSuccessModal(true)
    } catch (error: any) {
      console.error('Error casting vote:', error)
      setErrorMessage(error.response?.data?.message || 'Failed to cast vote')
      setShowErrorModal(true)
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('voter')
    navigate('/voter-login')
  }

  if (loading) {
    return (
      <div className='flex min-h-screen items-center justify-center'>
        Loading...
      </div>
    )
  }

  if (!voter) {
    return null
  }

  if (voter.has_voted) {
    return (
      <div className='container mx-auto px-4 py-8'>
        <div className='mb-8 flex items-center justify-between'>
          <h1 className='text-3xl font-bold'>Welcome, {voter.name}</h1>
          <Button variant='outline' onClick={handleLogout}>
            <LogOut className='mr-2 h-4 w-4' /> Logout
          </Button>
        </div>
        <Card>
          <CardContent className='p-6'>
            <div className='text-center'>
              <h2 className='mb-2 text-2xl font-semibold text-green-600'>
                You have already voted!
              </h2>
              <p className='text-gray-600'>
                Thank you for participating in the election process.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const selectedPoll = polls.find((poll) => poll.poll_id === selectedPollId)
  const today = new Date()

  return (
    <div className='container mx-auto px-4 py-8'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className='text-3xl font-bold'>Welcome, {voter.name}</h1>
        <Button variant='outline' onClick={handleLogout}>
          <LogOut className='mr-2 h-4 w-4' /> Logout
        </Button>
      </div>

      {polls.length > 0 ? (
        <form onSubmit={handleSubmit}>
          <div className='space-y-6'>
            {selectedPoll && (
              <Card className='w-full'>
                <CardContent className='p-6'>
                  <div className='mb-4'>
                    <h2 className='text-2xl font-semibold'>
                      {selectedPoll.name}
                    </h2>
                    <p className='text-gray-600'>
                      State: {selectedPoll.state.name} (
                      {selectedPoll.state.abbreviation})
                    </p>
                    <p className='text-gray-600'>
                      Duration:{' '}
                      {new Date(selectedPoll.start_date).toLocaleDateString()} -{' '}
                      {new Date(selectedPoll.end_date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className='mt-6'>
                    <h3 className='mb-4 text-lg font-medium'>
                      Select Party to Vote
                    </h3>
                    <RadioGroup
                      value={selectedParty}
                      onValueChange={setSelectedParty}
                      className='space-y-4'
                    >
                      {selectedPoll.parties.map((party) => (
                        <div
                          key={party.party_id}
                          className='flex cursor-pointer items-center space-x-4 rounded-lg border p-4 transition-colors hover:bg-gray-50'
                        >
                          <RadioGroupItem
                            value={party.party_id.toString()}
                            id={party.party_id.toString()}
                            disabled={submitting}
                          />
                          <div className='flex flex-1 items-center space-x-4'>
                            {party.logo ? (
                              <img
                                src={party.logo}
                                alt={party.name}
                                className='h-12 w-12 object-contain'
                              />
                            ) : (
                              <div className='flex h-12 w-12 items-center justify-center rounded-full bg-gray-200'>
                                <Shield className='h-6 w-6 text-gray-400' />
                              </div>
                            )}
                            <div className='flex-1'>
                              <h3 className='font-medium'>{party.name}</h3>
                              <p className='text-sm text-gray-500'>
                                {party.abbreviation}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <Button
                    type='submit'
                    className='mt-6 w-full'
                    disabled={!selectedParty || submitting}
                    onClick={handleSubmit}
                  >
                    {submitting ? 'Casting Vote...' : 'Cast Vote'}
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </form>
      ) : (
        <Card>
          <CardContent className='p-6'>
            <div className='text-center'>
              <h2 className='mb-2 text-2xl font-semibold text-gray-600'>
                No Polls Available
              </h2>
              <p className='text-gray-600'>
                There are currently no polls conducted for your state.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <SuccessModal
        open={showSuccessModal}
        onClose={() => {
          setShowSuccessModal(false)
          navigate('/voter-login')
        }}
      />
      <ErrorModal
        open={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        message={errorMessage}
      />
    </div>
  )
}
