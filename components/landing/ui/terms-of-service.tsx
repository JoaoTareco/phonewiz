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

export default function TermsOfServiceDialog() {
  return (
    <Dialog >
      <DialogTrigger asChild>
       <span className="text-sm">Terms of Service</span>
      </DialogTrigger>
      <DialogContent className="max-w-[80vh]">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4 overflow-scroll max-h-[80vh] overflow-x-hidden">
        <div className="mx-auto p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">User Agreement for Ctrlcap Services</h1>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acknowledgment and Acceptance of Terms</h2>
            <p className="text-base">
                By utilizing any services provided by ctrlcap (&quot;Services&quot;), you indicate your agreement to comply with the following terms and conditions (&quot;Terms&quot;). Please note that ctrlcap is the operating entity of the Services. These Terms are subject to modification by ctrlcap at any time without prior notice. We recommend reviewing these Terms periodically, as your continued use of the Services signifies your acceptance of any revised terms. If you do not agree to these Terms, please refrain from accessing or using the Services.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Membership</h2>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Registration</h3>
            <p className="text-base">
                To access our Services fully, users must register as members by providing accurate email information. Users are prohibited from using email addresses that infringe upon third-party rights.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Email Communication</h3>
            <p className="text-base">
                Communication between users and ctrlcap primarily occurs via email. Therefore, users acknowledge that ctrlcap may utilize their email addresses to disseminate information regarding system updates, product releases, company news, and account status changes. It is the user&apos;s responsibility to thoroughly review all emails from ctrlcap to stay informed. ctrlcap bears no responsibility for information not received due to failure to read emails.
            </p>
            <h3 className="text-xl font-semibold text-gray-800 mt-4 mb-2">Account Security</h3>
            <p className="text-base">
                Users must maintain the confidentiality of their email credentials, as they serve as the sole means of login. Users are liable for all activities conducted under their accounts. ctrlcap disclaims responsibility for unauthorized access to user accounts. Users must promptly notify ctrlcap upon becoming aware of any unauthorized account access.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Account Ownership</h2>
            <p className="text-base">
                If users register on behalf of an employer, the employer assumes ownership of the account. Users warrant having the authority to bind their employer to these Terms.
            </p>
            <p className="text-base mt-4">
                Users may transfer account ownership rights to a third party after notifying ctrlcap and updating account information accordingly. Once an account is transferred, the previous owner relinquishes all ownership claims. This provision excludes lifetime licenses.
            </p>
            <p className="text-base mt-4">
                In cases of disputes regarding account ownership, ctrlcap reserves the right to determine the rightful owner. If ownership cannot be ascertained, ctrlcap may suspend the account until resolution is achieved. Any outstanding dues must be paid by the rightful account owner(s).
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payments and Refunds</h2>
            <p className="text-base">
                ctrlcap offers subscription and one-off packages. Subscriptions entail automatic billing per billing cycle. ctrlcap does not issue partial or full refunds for any packages. Users averse to subscription commitments may opt for one-off packages.
            </p>
            <p className="text-base mt-4">
                Pricing and terms of subscription plans are subject to modification by ctrlcap without additional notice. Any changes will be publicly posted on the website.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Termination and Cancellation of Service</h2>
            <p className="text-base">
                Users may terminate Services at any time. To avoid being billed for the subsequent billing cycle, users must initiate service cancellation before the due date. Users should contact ctrlcap to effect cancellations.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Disclaimer of Warranties</h2>
            <p className="text-base">
                All materials and services provided on ctrlcap&apos;s platform are offered on an &quot;as is&quot; and &quot;as available&quot; basis without warranties, whether express or implied. ctrlcap makes no guarantees regarding the suitability, timeliness, security, or accuracy of the Services. Users agree to assume all risks associated with service usage.
            </p>
            <p className="text-base mt-4">
                ctrlcap may experience temporary service interruptions beyond its control. Users acknowledge that ctrlcap bears no liability for disruptions or delays in service availability.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitation of Liability</h2>
            <p className="text-base">
                ctrlcap and its affiliates shall not be liable to users or third parties for any special, punitive, indirect, or consequential damages arising from service usage. This includes loss of profits, data, or use, regardless of whether ctrlcap was advised of the possibility of such damages.
            </p>
            <p className="text-base mt-4">
                ctrlcap assumes no responsibility for third-party goods and services offered through its platform. Users engage in such transactions at their own risk.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Indemnification</h2>
            <p className="text-base">
                Users agree to defend, indemnify, and hold ctrlcap and its affiliates harmless from any liabilities, claims, or expenses arising from their use of the Services. ctrlcap reserves the right to assume control of any defense or settlement.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. International Use</h2>
            <p className="text-base">
                While ctrlcap&apos;s platform may be accessible worldwide, users are responsible for compliance with local laws. ctrlcap does not guarantee the legality of accessing its platform from territories where its content is prohibited.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Termination of Use</h2>
            <p className="text-base">
                ctrlcap may terminate or suspend user access to the platform at its discretion and without prior notice for any violation of these Terms. Upon termination, users must cease using the Services, and ctrlcap may deactivate or delete user accounts and associated information.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Notices</h2>
            <p className="text-base">
                All communications between ctrlcap and users shall be in writing via email or conventional mail. Notices to ctrlcap must be directed to Customer Service at <a href="mailto:support@ctrlcap.com" className="text-primary underline">support@ctrlcap.com</a>. Notices to users will be sent to the email address provided during registration.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Entire Agreement</h2>
            <p className="text-base">
                These Terms constitute the entire agreement between ctrlcap and users, superseding any prior agreements or understandings. No alterations to these Terms are valid unless agreed upon in writing by ctrlcap and users.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Miscellaneous</h2>
            <p className="text-base">
                In any legal action related to these Terms, the prevailing party is entitled to costs and attorney&apos;s fees. Any claims against ctrlcap must be filed within one year of the cause of action&apos;s occurrence.
            </p>
            <p className="text-base mt-4">
                Users may not assign their rights and obligations under these Terms without ctrlcap&apos;s consent. ctrlcap may freely assign its rights and obligations.
            </p>
            <p className="text-base mt-4">
                If any provision of these Terms is deemed invalid or unenforceable, the remaining provisions shall remain in effect. Failure by ctrlcap to enforce any provision does not waive its right to do so in the future.
            </p>
        </section>

        <section className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Contact Information</h2>
            <p className="text-base">
                To report violations of these Terms, please contact ctrlcap at <a href="mailto:support@ctrlcap.com" className="text-primary underline">support@ctrlcap.com</a>.
            </p>
        </section>
    </div>
        </div>
      
      </DialogContent>
    </Dialog>
  )
}
