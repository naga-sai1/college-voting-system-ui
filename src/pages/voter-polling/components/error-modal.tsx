import { AlertCircle } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ErrorModalProps {
  isOpen: boolean
  onClose: () => void
  message: string
}

export function ErrorModal({ isOpen, onClose, message }: ErrorModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-[#0A0F1C] to-[#1A2035] text-white border-red-400">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-red-400">Vote Submission Failed</DialogTitle>
          <DialogDescription className="text-xl text-gray-300">
            {message}
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <div className="rounded-full bg-gradient-to-r from-red-500 to-pink-500 p-4">
            <AlertCircle className="h-12 w-12 text-white" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

