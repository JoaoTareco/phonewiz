import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function PrivacyPolicyDialog() {
  return (
    <Dialog >
      <DialogTrigger asChild>
       <span className="text-sm">Privacy Policy</span>
      </DialogTrigger>
      <DialogContent className="max-w-[80vh]">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-scroll max-h-[80vh] overflow-x-hidden">
        <div className="mx-auto p-6">
        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy Assurance</h2>
            <p className="text-base">
                Ctrlcap values your privacy and is dedicated to the preservation of your personal data. This Privacy Policy details our approach to the acquisition, application, and protection of the information you submit while using our platform.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Collection of Personal Data</h2>
            <p className="text-base">
                When you register for an account with us, we only collect your email address. No other personal identification data is gathered.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Data Utilization</h2>
            <p className="text-base">
                We use your email address exclusively for the distribution of our newsletter and for the administration of your account, which includes login assistance and support. Your personal data is never disclosed to third parties.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Content Review</h2>
            <p className="text-base">
                Any content you create using our platform, and their respective inputs, can be assessed by Ctrlcap. This is done with the sole purpose of improving the quality of our product. Your posts will never be disclosed to third parties.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Get in Touch</h2>
            <p className="text-base">
                For any inquiries or feedback regarding this Privacy Policy or your personal data, to request access or corrections, to exercise any rights you may have, to lodge a complaint, or to learn more about our policies and practices, please contact us at <a href="mailto:support@ctrlcap.com" class="text-primary underline">support@ctrlcap.com</a>.
            </p>
        </section>
    </div>
        </div>
      
      </DialogContent>
    </Dialog>
  )
}
