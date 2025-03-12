//@ts-nocheck
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Loader2,
  ArrowLeft,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/custom/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getAllStates, getAllParties, conductPoll } from '@/api'
import { Checkbox } from '@/components/ui/checkbox'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'

interface Party {
  id: number
  name: string
  abbreviation: string
  logo: string | null
  state_id: number
  state_name: string
}

interface State {
  id: number
  name: string
}

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'Poll name must be at least 2 characters.',
  }),
  description: z.string().min(2, {
    message: 'Poll description must be at least 2 characters.',
  }),
  start_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'Start date must be in YYYY-MM-DD format',
  }),
  end_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'End date must be in YYYY-MM-DD format',
  }),
  state_id: z.string(),
  party_list: z.array(z.number()).min(1, {
    message: 'Select at least 1 party',
  }),
})

export default function ConductPoll() {
  const [parties, setParties] = useState<Party[]>([])
  const [states, setStates] = useState<State[]>([])
  const [selectedState, setSelectedState] = useState<string>('')
  const [filteredParties, setFilteredParties] = useState<Party[]>([])
  const [loading, setLoading] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      state_id: '',
      party_list: [],
    },
  })

  const watchedState = form.watch('state_id')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [partiesRes, statesRes] = await Promise.all([
          getAllParties(),
          getAllStates(),
        ])
        setParties(partiesRes.parties || [])
        setStates(statesRes.states || [])
      } catch (error) {
        console.error('Error fetching data:', error)
        setErrorMessage('Failed to fetch data. Please try again.')
        setShowErrorModal(true)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const stateId = form.getValues().state_id
    console.log('Current state_id:', stateId)
    console.log('All parties:', parties)

    if (stateId) {
      const filtered = parties.filter((party) => {
        const partyStateId = party.state_id?.toString()
        const formStateId = stateId?.toString()
        console.log(
          `Comparing party state_id: ${partyStateId} with form state_id: ${formStateId}`
        )
        return partyStateId === formStateId
      })
      console.log('Filtered parties:', filtered)
      setFilteredParties(filtered)
    } else {
      setFilteredParties([])
    }
  }, [watchedState, parties])

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setLoading(true)
      const response = await conductPoll(values)

      setShowSuccessModal(true)
      form.reset()
    } catch (error: any) {
      console.error('Error conducting poll:', error)
      setErrorMessage(error.response?.data?.message || 'Failed to conduct poll')
      setShowErrorModal(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-[#0A0F1C] to-[#1A1F2C] p-8'>
      <Button
        onClick={() => window.history.back()}
        variant='ghost'
        className='mb-4 text-white hover:bg-white/10'
      >
        <ArrowLeft className='mr-2 h-4 w-4' />
        Back
      </Button>

      <Card className='mx-auto max-w-2xl bg-white/5 backdrop-blur-sm'>
        <CardContent className='p-8'>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='mb-8 flex items-center gap-2'
          >
            <ShieldCheck className='h-8 w-8 text-violet-400' />
            <span className='text-2xl font-semibold text-white'>
              Conduct State Poll
            </span>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>Poll Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter poll name'
                        className='border-white/20 bg-white/10 text-white focus:border-violet-400 focus:ring-violet-400'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Optional poll description'
                        className='border-white/20 bg-white/10 text-white focus:border-violet-400 focus:ring-violet-400'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='start_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>Start Date</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        className='border-white/20 bg-white/10 text-white focus:border-violet-400 focus:ring-violet-400'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='end_date'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>End Date</FormLabel>
                    <FormControl>
                      <Input
                        type='date'
                        className='border-white/20 bg-white/10 text-white focus:border-violet-400 focus:ring-violet-400'
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='state_id'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>State</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value)
                          setSelectedState(value)
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className='border-white/20 bg-white/10 text-white'>
                          <SelectValue placeholder='Select a state'>
                            {
                              states.find(
                                (state) => state.id.toString() === field.value
                              )?.name
                            }
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {states.map((state) => (
                            <SelectItem
                              key={state.id}
                              value={state.id.toString()}
                            >
                              {state.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='party_list'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>Parties</FormLabel>
                    <FormControl>
                      <div className='space-y-2'>
                        {filteredParties.map((party) => (
                          <div
                            key={party.id}
                            className='flex items-center space-x-2 rounded-lg border border-white/10 bg-white/5 p-3'
                          >
                            <Checkbox
                              checked={field.value?.includes(party.id)}
                              onCheckedChange={(checked) => {
                                const current = field.value || []
                                const newValue = checked
                                  ? [...current, party.id]
                                  : current.filter((v) => v !== party.id)
                                field.onChange(newValue)
                              }}
                            />
                            <div className='flex items-center space-x-3'>
                              {party.logo && (
                                <img
                                  src={party.logo}
                                  alt={party.name}
                                  className='h-8 w-8 rounded-full object-cover'
                                />
                              )}
                              <span className='text-sm text-white'>
                                {party.name} ({party.abbreviation})
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full bg-violet-600 text-white transition-colors hover:bg-violet-700'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Conducting Poll...
                  </>
                ) : (
                  'Conduct Poll'
                )}
              </Button>
            </form>
          </Form>

          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='mt-4'
            >
              <Progress value={50} className='w-full' />
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <Dialog
            open={showSuccessModal}
            onOpenChange={(open) => {
              if (!open) {
                form.reset()
              }
              setShowSuccessModal(open)
            }}
          >
            <DialogContent className='bg-[#0A0F1C] text-white sm:max-w-[425px]'>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <DialogTitle className='flex items-center gap-2'>
                    <CheckCircle className='h-6 w-6 text-green-500' />
                    Poll Started Successfully
                  </DialogTitle>
                  <DialogDescription className='text-gray-300'>
                    The poll has been started for the selected state and
                    parties.
                  </DialogDescription>
                </DialogHeader>
                <div className='mt-4 flex justify-end'>
                  <Button
                    onClick={() => setShowSuccessModal(false)}
                    className='bg-violet-600 hover:bg-violet-700'
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>

      {/* Error Modal */}
      <AnimatePresence>
        {showErrorModal && (
          <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
            <DialogContent className='bg-[#0A0F1C] text-white sm:max-w-[425px]'>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <DialogHeader>
                  <DialogTitle className='flex items-center gap-2'>
                    <XCircle className='h-6 w-6 text-red-500' />
                    Failed to Conduct Poll
                  </DialogTitle>
                  <DialogDescription className='text-gray-300'>
                    {errorMessage}
                  </DialogDescription>
                </DialogHeader>
                <div className='mt-4 flex justify-end'>
                  <Button
                    onClick={() => setShowErrorModal(false)}
                    className='bg-violet-600 hover:bg-violet-700'
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </div>
  )
}
