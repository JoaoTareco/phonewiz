import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "react-hot-toast"

interface WaitlistDialogProps {
  isOpen: boolean
  onClose: () => void
}

export function WaitlistDialog({ isOpen, onClose }: WaitlistDialogProps) {
  const [email, setEmail] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (response.ok) {
        toast.success("You've been added to the waitlist!")
        onClose()
      } else {
        toast.error("There was an error. Please try again.")
      }
    } catch (error) {
      toast.error("There was an error. Please try again.")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join our Waitlist</DialogTitle>
          <DialogDescription>
            Sign up to be notified when we launch!
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" className="mt-4">Join Waitlist</Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}