import { Check } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface SuccessModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SuccessModal({ isOpen, onClose }: SuccessModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gradient-to-br from-[#0A0F1C] to-[#1A2035] text-white border-cyan-400">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold text-cyan-400">Vote Submitted Successfully</DialogTitle>
          <DialogDescription className="text-xl text-gray-300">
            Your vote has been recorded. Thank you for participating in the democratic process.
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center mt-6">
          <div className="rounded-full bg-gradient-to-r from-green-400 to-cyan-500 p-4">
            <Check className="h-12 w-12 text-white" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

