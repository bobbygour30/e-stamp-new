import React from 'react';
import { 
  Shield, 
  RefreshCw, 
  CreditCard, 
  Clock, 
  AlertCircle,
  Mail,
  CheckCircle,
  XCircle,
  Truck,
  FileText,
  Scale,
  AlertTriangle,
  Send,
  Calendar
} from 'lucide-react';

export default function RefundPolicy() {
  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: Shield,
      content: `We know the importance of money and we value your hard-earned money and appreciate your trust in us. We provide an upfront policy of payment for the Orders placed for Legal Services and/or other.
      
After placing an order, if the Customer wishes to cancel the order, the Customer shall send an email to info@easyesatmp.com along with the details of the order that needs to be canceled and can ask for the cancellation of the order by stating a valid reason.`
    },
    {
      id: 'non-cancellable',
      title: 'Non-Cancellable Orders',
      icon: XCircle,
      subtitle: 'The following categories of documents cannot be cancelled:',
      items: [
        'If the draft of the document has been shared with the Customer at their registered email address for review.',
        'If the Stamp paper has been procured/generated.',
        'If the Government servers of stamping are down.',
        'If the Order has been shipped through the Carrier partner.'
      ],
      note: 'The Request for cancellation in the aforesaid circumstances shall not be entertained.'
    },
    {
      id: 'refund-request',
      title: 'When Can You Request a Refund?',
      icon: RefreshCw,
      content: `We accept refund requests if the service has been denied at our end; in that case, we issue the complete refund as per the Order receipt.`
    },
    {
      id: 'refund-policy-details',
      title: 'Refund Policy Details',
      icon: CreditCard,
      sections: [
        {
          title: 'Processing Time',
          icon: Clock,
          content: 'We will process your request within 2 to 3 business days of receiving all the information required for processing the refund like a reason for refund, details for processing the request, etc.'
        },
        {
          title: 'Change of Mind',
          icon: AlertCircle,
          content: 'We would be unable to process any refund request owing to changes in your situation or your state of mind. However, depending on the circumstances, we would be able to credit your account with an amount equivalent to the Order you wish to cancel, and you can use the same to avail of any of our other services.'
        },
        {
          title: 'Service Hold',
          icon: Calendar,
          content: 'In case you require us to hold the processing of a service, we will hold the fee paid on your account until you are ready to commence the service.'
        },
        {
          title: 'Best Effort to Complete',
          icon: CheckCircle,
          content: 'Before processing any refund, we reserve the right to make the best effort to complete the service.'
        }
      ]
    },
    {
      id: 'non-refundable',
      title: 'Non-Refundable Fees',
      icon: AlertTriangle,
      content: `Please note that in no event shall any fees paid as Government Fees, Stamp Duty, Advocate/Notary Public Fees, and/or other charges paid to third-party vendors be refunded.`,
      items: [
        'Government Fees',
        'Stamp Duty',
        'Advocate/Notary Public Fees',
        'Third-party vendor charges'
      ]
    },
    {
      id: 'third-party',
      title: 'Third-Party Service Providers',
      icon: Truck,
      content: `While we take all reasonable steps to ensure that the order is delivered in a timely manner, there might be some delays when we use the services of Third Party Service Providers. Please note that we are not responsible for the handling of the document by the said Service Providers, or in case of delay in receipt of the document, owing to the delay or deficiency of service attributable to the Service Providers.`
    },
    {
      id: 'governing-law',
      title: 'Governing Law',
      icon: Scale,
      content: `This Refund Policy shall be governed by and construed in accordance with the laws of Delhi NCR, without regard to its conflict of law provisions.`
    },
    {
      id: 'changes',
      title: 'Changes to This Refund Policy',
      icon: FileText,
      content: `We reserve the right to update or change our Refund Policy at any time and you should check this Refund Policy periodically. Your continued use of the Service after we post any modifications to the Refund Policy on this page will constitute your acknowledgment of the modifications and your consent to abide and be bound by the modified Refund Policy.`
    },
    {
      id: 'contact',
      title: 'Contact Us',
      icon: Mail,
      content: `If you have any questions about this Refund Policy, please contact us:`,
      contactInfo: [
        { method: 'Email', value: 'info@easyesatmp.com', icon: Mail }
      ],
      note: 'In case of any conflict between this policy and our Terms of Service, the latter shall prevail.'
    }
  ];

  const LastUpdated = () => (
    <div className="bg-green-50 rounded-lg p-4 mb-8 text-center border border-green-200">
      <p className="text-green-800 text-sm">
        Last Updated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-900 to-teal-900 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6">
            <RefreshCw size={40} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Refund Policy</h1>
          <p className="text-lg text-green-100 max-w-2xl mx-auto">
            Understanding your rights and our commitment to fair refund practices
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <LastUpdated />

        {/* Introduction Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-green-100 rounded-xl">
              <Shield size={28} className="text-green-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed mb-4">
                We know the importance of money and we value your hard-earned money and appreciate your trust in us. 
                We provide an upfront policy of payment for the Orders placed for Legal Services and/or other.
              </p>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
                <p className="text-blue-800">
                  <strong>Cancellation Request:</strong> After placing an order, if the Customer wishes to cancel the order, 
                  the Customer shall send an email to <strong>info@easyesatmp.com</strong> along with the details of the order 
                  that needs to be canceled and can ask for the cancellation of the order by stating a valid reason.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Non-Cancellable Orders Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle size={24} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Non-Cancellable Orders</h2>
          </div>
          <p className="text-gray-700 mb-4">The following categories of documents cannot be cancelled:</p>
          <div className="space-y-3 mb-4">
            {sections.find(s => s.id === 'non-cancellable')?.items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <XCircle size={18} className="text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
            <p className="text-red-700 text-sm">
              <strong>Note:</strong> The Request for cancellation in the aforesaid circumstances shall not be entertained.
            </p>
          </div>
        </div>

        {/* Refund Request Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <RefreshCw size={24} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">When Can You Request a Refund?</h2>
          </div>
          <div className="p-4 bg-green-50 rounded-lg border-l-4 border-green-500">
            <p className="text-green-800">
              We accept refund requests if the service has been denied at our end; in that case, 
              we issue the complete refund as per the Order receipt.
            </p>
          </div>
        </div>

        {/* Refund Policy Details */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-purple-100 rounded-lg">
              <CreditCard size={24} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Refund Policy Details</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sections.find(s => s.id === 'refund-policy-details')?.sections.map((section, idx) => (
              <div key={idx} className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition">
                <div className="flex items-center gap-2 mb-3">
                  <section.icon size={20} className="text-indigo-600" />
                  <h3 className="font-semibold text-gray-800">{section.title}</h3>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed">{section.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Non-Refundable Fees */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-100 rounded-lg">
              <AlertTriangle size={24} className="text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Non-Refundable Fees</h2>
          </div>
          <p className="text-gray-700 mb-4">
            Please note that in no event shall any fees paid as Government Fees, Stamp Duty, 
            Advocate/Notary Public Fees, and/or other charges paid to third-party vendors be refunded.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sections.find(s => s.id === 'non-refundable')?.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
                <AlertTriangle size={16} className="text-orange-500" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Third Party Service Providers */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Truck size={24} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Third-Party Service Providers</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            While we take all reasonable steps to ensure that the order is delivered in a timely manner, 
            there might be some delays when we use the services of Third Party Service Providers. 
            Please note that we are not responsible for the handling of the document by the said Service Providers, 
            or in case of delay in receipt of the document, owing to the delay or deficiency of service 
            attributable to the Service Providers.
          </p>
        </div>

        {/* Governing Law */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Scale size={24} className="text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Governing Law</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            This Refund Policy shall be governed by and construed in accordance with the laws of Delhi NCR, 
            without regard to its conflict of law provisions.
          </p>
        </div>

        {/* Changes to Policy */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FileText size={24} className="text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Changes to This Refund Policy</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            We reserve the right to update or change our Refund Policy at any time and you should check this 
            Refund Policy periodically. Your continued use of the Service after we post any modifications 
            to the Refund Policy on this page will constitute your acknowledgment of the modifications 
            and your consent to abide and be bound by the modified Refund Policy.
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl shadow-lg p-8 mb-8 border border-green-100">
          <div className="flex items-center gap-3 mb-4">
            <Send size={28} className="text-green-600" />
            <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
          </div>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Refund Policy, please contact us:
          </p>
          <div className="bg-white rounded-lg p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-green-600" />
              <a href="mailto:info@easyesatmp.com" className="text-green-600 hover:text-green-800 font-medium">
                info@easyesatmp.com
              </a>
            </div>
            <div className="text-sm text-gray-500">
              Response within 24-48 hours
            </div>
          </div>
          <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <p className="text-yellow-800 text-sm">
              <strong>Note:</strong> In case of any conflict between this policy and our Terms of Service, the latter shall prevail.
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 mt-8 pt-8 border-t border-gray-200">
          <p>© {new Date().getFullYear()} Easy Esatmp. All rights reserved.</p>
          <p className="mt-1">This Refund Policy was last updated on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
}