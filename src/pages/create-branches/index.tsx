import { useState } from 'react'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { createBranch } from '@/api'

const formSchema = z.object({
  branchName: z.string().min(2, {
    message: 'branch name must be at least 2 characters.',
  }),
  abbreviation: z.string().min(1, {
    message: 'Abbreviation is required.',
  }),
})

function CreateBranch() {
  //   const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [progress, setProgress] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      branchName: '',
      abbreviation: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true)
    try {
      const formData = new FormData()
      formData.append('name', values.branchName)
      formData.append('abbreviation', values.abbreviation)

      let progressValue = 0
      const interval = setInterval(() => {
        progressValue += 10
        setProgress(Math.min(progressValue, 90)) // Cap at 90% until request completes
      }, 200)

      await createBranch(formData)
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
            <span className='text-2xl font-semibold text-white'>
              Create Branch
            </span>
          </motion.div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='branchName'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='text-gray-200'>Branch Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter branch name'
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
                      Branch Abbreviation
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder='Enter branch abbreviation'
                        {...field}
                        className='border-white/20 bg-white/10 text-white placeholder:text-gray-500 focus:border-violet-400 focus:ring-violet-400'
                      />
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
                    Creating Branch...
                  </>
                ) : (
                  'Create Branch'
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
                    Branch Created Successfully
                  </DialogTitle>
                  <DialogDescription className='text-gray-300'>
                    Your branch has been successfully created. You can now start
                    voting.
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
                    Failed to Create Branch
                  </DialogTitle>
                  <DialogDescription className='text-gray-300'>
                    An error occurred while creating your branch. Please try
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

export default CreateBranch
