//@ts-nocheck
import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import {
  ShieldCheck,
  CheckCircle,
  XCircle,
  Upload,
  Loader2,
  ArrowLeft,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { Button } from '@/components/custom/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormDescription,
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
import { getAllStates, createPoll } from '@/api'

const formSchema = z.object({
  partyName: z.string().min(2, {
    message: 'Party name must be at least 2 characters.',
  }),
  abbreviation: z.string().min(1, {
    message: 'Abbreviation is required.',
  }),
  state: z.string({
    required_error: 'Please select a state.',
  }),
  partyLogo: z.instanceof(File).optional(),
})

  function CreateParty() {
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [states, setStates] = useState<

    Array<{ id: number; name: string; abbreviation: string }>
  >([])

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      partyName: '',
      abbreviation: '',
      state: '',
    },
  })

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = (await getAllStates()) as {
          states: Array<{ id: number; name: string; abbreviation: string }>
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
      formData.append('name', values.partyName)
      formData.append('abbreviation', values.abbreviation)
      formData.append('state_id', values.state)
      if (values.partyLogo) {
        formData.append('logo', values.partyLogo)
      }

      let progressValue = 0
      const interval = setInterval(() => {
        progressValue += 10
        setProgress(Math.min(progressValue, 90)) // Cap at 90% until request completes
      }, 200)

      await createPoll(formData)
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

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setLogoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      form.setValue('partyLogo', file)
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
              Create Voting Party
            </span>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='partyName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>Party Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter party name'
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
                name='abbreviation'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>
                      Party Abbreviation
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter party abbreviation'
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
              <FormField
                control={form.control}
                name='partyLogo'
                render={({ field: { value, ...field } }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>Party Logo</FormLabel>
                    <FormControl>
                      <div className='flex items-center space-x-4'>
                        <div className='relative'>
                          <Input
                            type='file'
                            accept='image/*'
                            onChange={handleLogoChange}
                            className='hidden'
                            id='logo-upload'
                          />
                          <label
                            htmlFor='logo-upload'
                            className='flex h-32 w-32 cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-white/20 transition-colors hover:border-violet-400'
                          >
                            {logoPreview ? (
                              <img
                                src={logoPreview || '/placeholder.svg'}
                                alt='Party Logo Preview'
                                className='h-full w-full rounded-lg object-cover'
                              />
                            ) : (
                              <Upload className='h-8 w-8 text-gray-400' />
                            )}
                          </label>
                        </div>
                        <div className='flex-1'>
                          <FormDescription className='mb-2 text-gray-400'>
                            Upload a logo for the party (optional)
                          </FormDescription>
                          <Button
                            type='button'
                            variant='outline'
                            onClick={() =>
                              document.getElementById('logo-upload')?.click()
                            }
                            className='w-full border-white/20 text-white hover:bg-white/10'
                          >
                            Choose File
                          </Button>
                        </div>
                      </div>
                    </FormControl>
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
                    Creating Poll...
                  </>
                ) : (
                  'Create Poll'
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
                    Poll Created Successfully
                  </DialogTitle>
                  <DialogDescription className='text-gray-300'>
                    Your voting poll has been created and is now live.
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
                    Failed to Create Poll
                  </DialogTitle>
                  <DialogDescription className='text-gray-300'>
                    There was an error creating your voting poll. Please try
                    again.
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

export default CreateParty
