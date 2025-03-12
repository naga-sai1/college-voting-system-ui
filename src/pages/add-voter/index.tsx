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

import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
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
import { getAllStates, addVoter } from '@/api'

const formSchema = z.object({
  voterName: z.string().min(2, {
    message: 'Voter name must be at least 2 characters.',
  }),
  aadhaarNumber: z.string().min(1, {
    message: 'aadhaarNumber is required.',
  }),
  phoneNumber: z.string().min(1, {
    message: 'phoneNumber is required.',
  }),
  state: z.string({
    required_error: 'Please select a state.',
  }),
})

const formatAadhaarNumber = (value: string) => {
  // Remove all non-digit characters
  const digits = value.replace(/\D/g, '')

  // Format with spaces after every 4 digits
  let formatted = ''
  for (let i = 0; i < digits.length && i < 12; i++) {
    if (i > 0 && i % 4 === 0) {
      formatted += ' '
    }
    formatted += digits[i]
  }

  return formatted
}

function AddVoter() {
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [states, setStates] = useState<
    Array<{ id: number; name: string; aadhaarNumber: string }>
  >([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voterName: '',
      aadhaarNumber: '',
      phoneNumber: '',
      state: '',
    },
  })

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = (await getAllStates()) as {
          states: Array<{ id: number; name: string; aadhaarNumber: string }>
        }
        setStates(response.states)
      } catch (error) {
        console.error('Failed to fetch states:', error)
      }
    }
    fetchStates()
  }, [])

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('name', values.voterName)
      formData.append('aadhar', values.aadhaarNumber)
      formData.append('phone_no', values.phoneNumber)
      formData.append('state_id', values.state)

      let progressValue = 0
      const interval = setInterval(() => {
        progressValue += 10
        setProgress(Math.min(progressValue, 90)) // Cap at 90% until request completes
      }, 200)

      await addVoter(formData)
      setProgress(100)
      clearInterval(interval)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Failed to create poll:', error)
      setShowErrorModal(true)
    } finally {
      setIsSubmitting(false)
      setProgress(0)
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
            <span className='text-2xl font-semibold text-white'>Add Voter</span>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='voterName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>Voter Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter voter name'
                        {...field}
                        className='border-white/20 bg-white/10 text-white placeholder:text-gray-500 focus:border-violet-400 focus:ring-violet-400'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='aadhaarNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>
                      Voter Aadhaar Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='XXXX XXXX XXXX'
                        {...field}
                        onChange={(e) => {
                          const formatted = formatAadhaarNumber(e.target.value)
                          e.target.value = formatted
                          field.onChange(formatted)
                        }}
                        maxLength={14} // 12 digits + 2 spaces
                        className='border-white/20 bg-white/10 text-white placeholder:text-gray-500 focus:border-violet-400 focus:ring-violet-400'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phoneNumber'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>
                      Voter Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter voter phone number'
                        maxLength={10}
                        // Only allow digits
                        onKeyPress={(e) => {
                          if (!/[0-9]/.test(e.key)) {
                            e.preventDefault()
                          }
                        }}
                        {...field}
                        className='border-white/20 bg-white/10 text-white placeholder:text-gray-500 focus:border-violet-400 focus:ring-violet-400'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='state'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className='border-white/20 bg-white/10 text-white focus:border-violet-400 focus:ring-violet-400'>
                          <SelectValue placeholder='Select a state' />
                        </SelectTrigger>
                      </FormControl>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type='submit'
                className='w-full bg-violet-600 text-white transition-colors hover:bg-violet-700'
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    Add Voter...
                  </>
                ) : (
                  'Add Voter'
                )}
              </Button>
            </form>
          </Form>

          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className='mt-4'
            >
              <Progress value={progress} className='w-full' />
            </motion.div>
          )}
        </CardContent>
      </Card>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccessModal && (
          <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
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
                    Voter Added Successfully
                  </DialogTitle>
                  <DialogDescription className='text-gray-300'>
                    The voter has been added to the voting poll successfully.
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
                    Failed to Add Voter
                  </DialogTitle>
                  <DialogDescription className='text-gray-300'>
                    An error occurred while adding the voter. Please try again
                    later.
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

export default AddVoter
