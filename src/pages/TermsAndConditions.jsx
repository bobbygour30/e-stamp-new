import React from 'react';
import { 
  Shield, 
  FileText, 
  Scale, 
  Mail,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Truck,
  Send,
  Calendar,
  Users,
  Briefcase,
  FileSearch,
  AlertTriangle,
  CreditCard,
  UserCheck,
  Eye,
  Lock,
  Server,
  HeartHandshake,
  Gavel,
  Link,
  Copy,
  Flag,
  Edit,
  Trash2,
  Phone,
  MapPin,
  Globe,
  BookOpen,
  Layers,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Star,
  Award,
  Zap,
  ShieldAlert,
} from 'lucide-react';

export default function TermsAndConditions() {
  const LastUpdated = () => (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 mb-8 text-center border border-blue-200">
      <p className="text-blue-800 text-sm font-medium">
        Last Updated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
      </p>
    </div>
  );

  const sections = [
    {
      id: 'agreement',
      title: 'Agreement between User and Easy Esatmp',
      icon: Shield,
      content: `Please read this terms of Service Agreement carefully. By using this Website or availing Services, you acknowledge that you have read and agree to be bound by this Agreement and all terms and conditions on this Website.
      
This is an agreement providing the terms and conditions between you and Easy Esatmp regarding the terms under which Easy Esatmp provides you its services including information and software that are made available through the website easyesatmp.com. The website easyesatmp.com consists of various pages all of which are prepared, handled and managed by Easy Esatmp. All the services of this website are offered to you under the condition of acceptance of these terms, conditions and notices contained in this document.`
    },
    {
      id: 'website-activities',
      title: 'Website Activities',
      icon: Layers,
      subtitle: 'While using the website easyesatmp.com you will have to do any or all of this:',
      items: [
        'Enter Personal Information',
        'Enter Property Details',
        'Click on Links',
        'Register or Enroll in an account',
        'Browse',
        'Create Document',
        'Request for Full Service and etc...'
      ],
      note: 'This Agreement includes, and incorporates by this reference, the policies and guidelines referenced below. Easy Esatmp encourages you to review this Agreement whenever you visit the Website to make sure that you understand the terms and conditions governing the use of the Website. This Agreement does not alter in any way the terms or conditions of any other written agreement you may have with rattler for services. If you do not agree to this Agreement (including any referenced policies or guidelines) or are below 18 years of age, please immediately terminate your use of the Website.'
    },
    {
      id: 'lawyer-relationship',
      title: 'Disclaimer of Lawyer-Client Relationship',
      icon: Briefcase,
      content: 'The website easyesatmp.com is neither a law firm nor an agent of any lawyer and does not provide any legal advice. The use of the services of the website by you does not create an attorney-client relationship between you and Easy Esatmp. Also, the advice is given by any of the team members of easyesatmp.com cannot be considered as a Legal advice.'
    },
    {
      id: 'relationship-parties',
      title: 'Relationship between Parties',
      icon: Users,
      content: 'Nothing in this Agreement shall be construed as creating an employer-employee relationship, a partnership, or a joint venture between you and Easy Esatmp. You acknowledge and agree that you are an independent contractor providing services to Easy Esatmp, and nothing in this Agreement shall be construed to restrict your ability to provide similar services to third parties.'
    },
    {
      id: 'disclaimer-orders',
      title: 'Disclaimer for the Orders',
      icon: FileSearch,
      content: `While placing an order on our website, the User/Customer hereby undertakes that all parties involved in the Document which the user is ordering from our website have agreed to and consented to all the clauses mentioned in the said Document. Furthermore, all the party(s) involved acknowledge and provide their consent that the Document can be prepared on our portal. The User/Customer affirms that all the party(s) involved in the concerned Document have complete knowledge of our website processing and the User/Customer takes full responsibility for creating such Document on our portal. The user also undertakes that any Document they draft on our website shall be used in a strictly legal manner. In the event of any conflict or issue, the user/customer agrees to assume sole Responsibility. We, Easy Esatmp shall not be held responsible in any such manner.`
    },
    {
      id: 'disclaimer-liability',
      title: 'Disclaimer of Liability',
      icon: AlertTriangle,
      content: `While utilizing our website, users acknowledge that they do so solely at their own risk. The information presented on our platform should not be interpreted as legal advice or a replacement for it. We serve as an intermediary between users and registered professionals, offering a convenient avenue to access services from legal experts and other professionals. easyesatmp.com cannot be held liable for any outcomes resulting from users relying on the information provided on our website or utilizing our services.`
    },
    {
      id: 'not-legal-advice',
      title: 'Not a Legal Advice',
      icon: BookOpen,
      content: `The information contained on the website should not be considered as legal advice. The information provided is to guide only. The information provided in the FAQs section also should not be considered as legal advice. These are commonly asked queries and queries related to Property related matters, Stamp papers, Rental agreements, Name Change Services, affidavits, and other documents.
      
Users are advised to consult Official Authorities if they need specialized and proper guidance on any of these documents.`
    },
    {
      id: 'name-change-package',
      title: 'Disclaimer for Name Change Package Service',
      icon: Award,
      content: `The publication of Gazette Notifications is exclusively managed by the Department of Publication, Government of India. The general indicative timeline for such publication is approximately 45 to 90 working days. However, this timeline is purely an estimate and subject to variation based on the internal processes and discretion of the Gazette Department.
      
Please be advised that easyesatmp.com acts solely as a facilitator for preparing and submitting Gazette-related applications and has no control, influence, or authority over the Gazette Department's timelines, decisions, or procedures.`,
      items: [
        'Central Government or Gazette Department holidays, official leaves, or shutdowns',
        'Administrative delays or internal backlogs within the Gazette office',
        'Strikes, protests, or any form of industrial action affecting public departments',
        'Technical issues, server downtimes, or system failures at the Gazette Department',
        'Natural calamities, pandemics, or any other force majeure events beyond our control',
        'Any other unforeseen circumstances affecting the regular functioning of the Gazette Department'
      ],
      note: 'easyesatmp.com shall not be held responsible or liable for any delay, advancement, rejection, or non-publication caused due to the above reasons or any similar uncontrollable factors.',
      premiumContent: {
        title: 'Under our Premium Package, we provide:',
        items: [
          'Preparation and submission of the application to the Gazette Department',
          'Routine follow-ups with the Department for status updates',
          'A downloadable copy of the Gazette Notification upon successful publication'
        ]
      },
      disclaimer: {
        title: 'Please note:',
        items: [
          'in does not guarantee any fixed publication date or assured approval',
          'All decisions, actions, and timelines are under the sole control of the Gazette Department',
          'in shall not be liable for any financial loss, personal inconvenience, legal consequence, or mental distress arising from delays or deviations in the Gazette process'
        ]
      },
      acknowledgement: 'By availing our services, you explicitly acknowledge and accept that easyesatmp.com is a private service platform offering assistance in document facilitation, and the ultimate authority for publication lies solely with the Government Gazette Department.'
    },
    {
      id: 'general-info',
      title: 'General Information to Common Man',
      icon: HelpCircle,
      content: `Since the law changes frequently and various revisions are done to the different laws of the country, any information provided by easyesatmp.com should not be relied upon as legal advice and easyesatmp.com cannot guarantee that all the information available on the website is current and correct. The website easyesatmp.com provides only general information to help the common man. So, if you require up-to-date advice you must consult to registered Lawyers/Legal Consultations even if you take the help of easyesatmp.com information.`
    },
    {
      id: 'limitation-liability',
      title: 'Limitation of Liability',
      icon: ShieldAlert,
      content: `easyesatmp.com will not be liable for any direct, indirect, incidental, special or consequential damages in connection with this agreement or the services in any manner, including liabilities resulting from (1) the use or the inability to use the website content; (3) any services obtained or transactions entered into through the website; or (4) any lost, profits you allege. Hence using Easy Esatmp is absolutely at your own risk.`
    },
    {
      id: 'fees',
      title: 'Fees',
      icon: CreditCard,
      content: `easyesatmp.com provides its services with nominal fees for each document which may vary from time to time. By availing of the Service or any portion of it, you agree to pay the fees whether full fees or in Installments for that service. You agree to provide information about your credit card or other forms of payment to Easy Esatmp and also update your account information immediately with any changes that may occur in your address or credit card expiration date or any other valid information necessary on the website.`
    },
    {
      id: 'submissions',
      title: 'Submissions/Approval',
      icon: CheckCircle,
      content: `If you approved the documents sent to you for your approval, then you agree that no further changes/modifications will be entertained. Any comments, questions, suggestions, feedback, or information provided by you about the service of our website are submissions made by you. Easy Esatmp shall have all the right to use your submissions for their promotion, marketing, or advertisement. Easy Esatmp may also remove any of your submissions and is not under any obligation to post your submission.`
    },
    {
      id: 'scan-timeline',
      title: 'Scan Copy Timeline',
      icon: Clock,
      items: [
        'If the order/approval upon draft/Documents has been received within the cut-off time of 2:30 PM then the scan shall be provided on same-day i.e. by or before 8:00 PM.',
        'If the Order/approval upon draft/Documents has been received after the cut-off time, then the scan shall be provided by the next working day (by 8:00 PM).',
        'For West Bengal & Maharashtra Notary Orders, the scan copy will take 24-48 hours.',
        'Saturday, Sunday & Govt Holidays are non-working days and orders didn\'t get processed on these days.',
        'Scan copy timelines cannot be expedited however we will try our best to provide it on time.',
        'Exceptions can occur and there can be delay in sharing scanned copies however it\'s a rare case.'
      ]
    },
    {
      id: 'disclaimer-scan',
      title: 'Disclaimer on Scan Copies',
      icon: Eye,
      content: `Kindly be noted that a "Scan copy" is considered a photocopy of the Originals hence we highly recommend customers opt for a hard copy as well; ensuring a tangible and authenticated record. The Hard-copies will be securely stored for a maximum of 10 days. After this period, we ensure the complete destruction of the Hard-copy; Customers can ask for the delivery of Hard-copy within this time frame and after that, no such requests shall be entertained.
      
Further, while placing the Order customers give their consent to preserve their Hard copies for 10 days and also give consent to destroy the Hard copies after the completion of the given time frame.`
    },
    {
      id: 'notarial-service',
      title: 'Notarial Service',
      icon: ShieldAlert,
      content: `easyesatmp.com do NOT provide Notarial Services, Easy Esatmp connect the Customers as per their request to the Notary Public/Attestation Officer and charges the fee accordingly. If any dispute is found in the Documents provided for Notarized then Easy Esatmp and Concerned Notary Public will not be responsible for the same, it will be the sole responsibility of the Customers.
      
Also, Notary Public holds the power to reject the attestation if they find any issue in the content of the concerned Document, and in such cases, attestation will not be processed and Easy Esatmp will not be liable/responsible for such rejection.
      
If Customer is choosing Notarial Service from our Website then they are also agreeing with the terms and conditions provided above.`
    },
    {
      id: 'prohibited-use',
      title: 'Illegal, Unlawful, and Prohibited Use Banned',
      icon: Flag,
      items: [
        'For any unlawful or illegal purposes',
        'For any prohibited purposes as under the website\'s terms and conditions',
        'To cause any repair or damage or to disable or impair the website',
        'To disrupt or interfere with any other party\'s use and enjoyment of this website',
        'Not to hack the website or steal the content as in scrapping or crawling etc using intermediaries like robots, crawlers, scrapers, or any other, or to access any information for which you have not been given permission to access through your payments made for any services of Easy Esatmp',
        'All the forms, legal documents, and all contents found on the website easyesatmp.com are protected by Copyright Act and intellectual property Act, and hence you have no right to resell any content of this website. Any such unlawful or prohibited use of the website easyesatmp.com shall be liable for legal action against you.'
      ]
    },
    {
      id: 'modifications',
      title: 'Modifications in Terms and Conditions',
      icon: Edit,
      content: `Easy Esatmp reserves the right to change or revise the terms and conditions of this Agreement at any time by posting any changes or a revised Agreement on this Website. Easy Esatmp will alert you that changes or revisions have been made by indicating on the top of this Agreement the date it was last revised. The changed or revised Agreement will be effective immediately after it is posted on this Website. Your use of the Website following the posting of any such changes or of a revised Agreement will constitute your acceptance of any such changes or revisions.`
    },
    {
      id: 'privacy',
      title: 'Privacy',
      icon: Lock,
      content: `Easy Esatmp believes strongly in protecting user privacy. Please refer to Easy Esatmp privacy policy, incorporated by reference herein, which is posted on the Website.`
    },
    {
      id: 'technical-errors',
      title: 'Disclaimer from Damages due to Technical Errors',
      icon: Server,
      content: `Since the technical processing and transmission of the service and your content happens through different networks and changes to adapt to the technical requirements of connecting networks and devices and hence if your content gets deleted or does not get stored even after uploading, Easy Esatmp shall not be held liable. You agree that Easy Esatmp shall not be liable to you for any termination discontinuance modification or suspension of service. Easy Esatmp is not responsible for any loss of data resulting from accidental or deliberate deletion, network or system outages, backup failure, file corruption, or any other reasons.`
    },
    {
      id: 'indemnification',
      title: 'Indemnification',
      icon: HeartHandshake,
      content: `You will release, indemnify, defend, and hold harmless Easy Esatmp, and any of its contractors, agents, employees, officers, directors, shareholders, affiliates and assigns from all liabilities, claims, damages, costs, and expenses, including reasonable attorneys' fees and expenses, of third parties relating to or arising out of (1) this Agreement or the breach of your warranties, representations, and obligations under this Agreement; (2) the Website content or your use of the Website content; (3) the Services or your use of the Services; (4) any intellectual property or other proprietary rights of any person or entity; (5) your violation of any provision of this Agreement; or (6) any information or data you supplied to Easy Esatmp.
      
When Easy Esatmp is threatened with suit or sued by a third party, Easy Esatmp may seek written assurances from you concerning your promise to indemnify Easy Esatmp; your failure to provide such assurances may be considered by Easy Esatmp to be a material breach of this Agreement. Easy Esatmp will have the right to participate in any defense by you of a third-party claim related to your use of any of the Website content or services, with counsel of Easy Esatmp choice at its expense. Easy Esatmp will reasonably cooperate in any defense by you of a third-party claim at your request and expense. You will have sole responsibility to defend Easy Esatmp against any claim, but you must receive Easy Esatmp prior written consent regarding any related settlement. The terms of this provision will survive any termination or cancellation of this Agreement or your use of the Website or services.`
    },
    {
      id: 'dispute-resolution',
      title: 'Dispute Resolution By Binding Arbitration',
      icon: Gavel,
      content: `Any dispute, controversy, or claim arising out of or relating to this Agreement, or the breach, termination, or invalidity thereof, shall be settled by arbitration in accordance with the Arbitration and Conciliation Act, 1996, and any amendments thereto. The arbitration shall be conducted in Delhi NCR by a single arbitrator appointed mutually by both parties. If the parties cannot agree on a single arbitrator, the arbitrator shall be appointed in accordance with the Arbitration and Conciliation Act, 1996. The language of the arbitration shall be English. The award of the arbitrator shall be final and binding on the parties.
      
The parties also agree to explore conciliation as a first step in resolving any disputes before proceeding to arbitration. The conciliation process shall be conducted in accordance with the provisions of the Arbitration and Conciliation Act, 1996. If the dispute is not resolved through conciliation within 30 days (or such a longer period as the parties may agree in writing) from the date of commencement of conciliation, either party may refer the dispute to arbitration as provided above.`
    },
    {
      id: 'cancellation-refund',
      title: 'Cancellation and Refund Policy',
      icon: ShieldAlert,
      content: `We know the importance of money. We value your hard-earned money and appreciate your trust in us. We provide an upfront policy of payment for the Orders placed for Legal Services and/or others.
      
After placing an order, if the Customer wishes to cancel the order, the Customer shall send an email to info@easyesatmp.com along with the details of the order that needs to be canceled and can ask for the cancellation of the order by stating a valid reason.`,
      items: [
        'If the draft of the document has been shared with the Customer at their registered email address for review.',
        'If the Stamp paper has been executed.',
        'If the Order has been shipped through the Carrier partner.',
        'If the Cancellation is owing to the fault of the Customer.'
      ],
      note: 'The Request for cancellation in the aforesaid circumstances shall not be entertained. Also, Please note that in case the Payment has been made by way of installments, with respect to Name Change Packages or other products, once the first installment is paid, there cannot be any cancellation request or Refund of any Installment Paid. To read more, please refer to our section.'
    },
    {
      id: 'delivery-policy',
      title: 'Delivery Policy',
      icon: Truck,
      content: `The Orders will be delivered through a partner delivery Company/Third Party and the delivery made by the Courier Partner are subject to their Terms and Conditions/Policies. The customer accepts that the delivery time provided is "estimated" and "not binding" to any of the Parties whereas the attempt to make the Order delivered under the specific time is a topmost priority. The estimated delivery time also depends on the destination to which the Customer wants the Order to be shipped and/or the shipping provider's delivery norms, and delays ascribe to shipping partners.
      
The Cut-off time to dispatch the Orders on the same day is 2:30 PM and applicable on Working Days. If Orders/Approval upon draft is received after the cut-off time and/or in Non-Working Days then it will be processed and dispatched on the Next Working Day. In case of heavy rains/ National Bandh/ festival season/ traffic jams/or any other reason that may restrict the delivery of the order delay can be expected which is beyond our Control. Also, Courier partners do not call prior to delivering an order at the Shipping Address, so we request to Customers provide an address at which Consignee OR related person shall be available to receive the Order.`,
      nonRefundableEvents: [
        'Delivery was not done due to a wrong address/pin-code provided by the Customer',
        'Requested for future delivery',
        'Recipient not available',
        'Premises was closed/locked',
        'Recipient refused to accept the Order',
        'Order delivered to Company\'s Reception, Security\'s Gate (if opted for official delivery)',
        'Not able to Connect to Recipient due to Incorrect Contact number/not working/not reachable/no reply'
      ],
      additionalNote: 'In case the recipient is not available, then the courier partner shall re-attempt the delivery and in case the address is wrong then the Customer shall update the address, and the courier partner will re-attempt the delivery at the revised address. The courier company will attempt to deliver the package thrice (as per their terms) before the Order returns back to the point of origin.'
    },
    {
      id: 'third-party-links',
      title: 'Link to Other Websites and Linking Disclaimer',
      icon: Link,
      content: `Any Third party content that may appear on our website or those which may be accessed through any links on our website is not the responsibility of Easy Esatmp. So Easy Esatmp shall not be responsible nor liable for any mistakes, omissions, falsehood, pornography, obscenity, misstatements of law, slander, libel, defamation, or any other content against the principles of law. Easy Esatmp has no control over the content of any third-party websites which are exclusively the thoughts and ideas of the third-party sites and not of Easy Esatmp. Any claim arising due to the use of such linked websites resulting in damages, is wholly disclaimed by Easy Esatmp.`
    },
    {
      id: 'governing-law',
      title: 'Governing Laws and Jurisdiction',
      icon: Scale,
      content: `This Agreement shall be governed by and the construed in accordance with the laws of Delhi NCR, without regards to its conflict of law provision. You agree that any legal action or proceeding between Easy Esatmp and you for any purpose concerning this Agreement or the Parties obligations hereunder shall be brought Exclusively in a federal or state court of competent Jurisdiction sitting in Delhi NCR. Any cause of action or claim you may have with respect to the service must be Commenced within one Year after the claim or cause of action arises or such claim or cause of action is barred.`
    },
    {
      id: 'agreement-bound',
      title: 'Agreement to be Bound',
      icon: UserCheck,
      content: `By using this Website or availing Services, you acknowledge that you have read and agree to be bound by this Agreement and all terms and conditions on this Website.`
    },
    {
      id: 'copyright',
      title: 'Copyrights And Intellectual Property Rights',
      icon: Copy,
      content: `You agree that nothing contained in this agreement shall be taken as conferring any license or right by any implication or otherwise under the copyright or Intellectual property rights. You agree and understand that all content in the website and the website as a whole are protected by copyright, trademark, service marks, patents, or other proprietary rights and laws. Hence you have no right to copy, extract and use this content without express authorization from Easy Esatmp. Contact Easy Esatmp before copying anything from the website with plans of reproducing it or distributing it.`
    },
    {
      id: 'assignment',
      title: 'Assignment',
      icon: Send,
      content: `You may not assign, transfer, or delegate any of your rights or obligations under this Agreement without the prior written consent of Easy Esatmp. Easy Esatmp may freely assign, transfer, or delegate any of its rights or obligations under this Agreement without restriction.`
    },
    {
      id: 'severability',
      title: 'Severability',
      icon: Layers,
      content: `If any provision of this Agreement is determined by a court of competent jurisdiction to be invalid, illegal, or unenforceable, the remaining provisions of this Agreement shall remain in full force and effect to the fullest extent permitted by law.`
    },
    {
      id: 'headings',
      title: 'Headings',
      icon: FileText,
      content: `The headings in this Agreement are for convenience only and shall not affect the interpretation of this Agreement.`
    },
    {
      id: 'contact',
      title: 'Contact Information',
      icon: Mail,
      content: `If you have any questions about this Agreement or the Service, please contact Easy Esatmp at:`,
      contactInfo: [
        { method: 'Email', value: 'info@easyesatmp.com', icon: Mail }
      ]
    },
    {
      id: 'general-conditions',
      title: 'General Conditions',
      icon: AlertCircle,
      subsections: [
        { title: 'Force Majeure', content: 'Easy Esatmp will not be deemed in default hereunder or held responsible for any cessation, interruption or delay in the performance of its obligations hereunder due to earthquake, flood, fire, storm, natural disaster, act of God, war, terrorism, armed conflict, labor strike, lockout, or boycott.' },
        { title: 'Cessation of Operation', content: 'Easy Esatmp may at any time, in its sole discretion and without advance notice to you, cease the operation of the Website.' },
        { title: 'Entire Agreement', content: 'This Agreement comprises the entire agreement between you and Easy Esatmp and supersedes any prior agreements pertaining to the subject matter contained herein. This Agreement, including any documents incorporated herein by reference, constitutes the entire agreement between you and Easy Esatmp concerning the subject matter hereof and supersedes all prior or contemporaneous negotiations, discussions, or agreements, whether written or oral, between the parties regarding such subject matter.' },
        { title: 'Effect of Waiver', content: 'The failure of Easy Esatmp to exercise or enforce any right or provision of this Agreement will not constitute a waiver of such right or provision. If any provision of this Agreement is found by a court of competent jurisdiction to be invalid, the parties nevertheless agree that the court should endeavor to give effect to the parties\' intentions as reflected in the provision, and the other provisions of this Agreement remain in full force and effect.' },
        { title: 'Statute of Limitation', content: 'You agree that regardless of any statute or law to the contrary, any claim or cause of action arising out of or related to the use of the Website or Products or this Agreement must be filed within one (1) year after such claim or cause of action arose or be forever barred.' },
        { title: 'Waiver of Class Action Rights', content: 'By entering into this agreement, you hereby irrevocably waive any right you may have to join claims with those of others in the form of a class action or similar procedural device. Any claims arising out of, relating to, or in connection with this agreement must be asserted individually.' },
        { title: 'Termination', content: 'Easy Esatmp reserves the right to terminate your access to the Website if it reasonably believes, in its sole discretion, that you have breached any of the terms and conditions of this Agreement. Following termination, you will not be permitted to use the Website and Easy Esatmp may, in its sole discretion and without advance notice to you, cancel any outstanding request for Services. If your access to the Website is terminated, Easy Esatmp reserves the right to exercise whatever means it deems necessary to prevent unauthorized access to the Website. This Agreement will survive indefinitely unless and until Easy Esatmp chooses, in its sole discretion and without advance to you, to terminate it.' }
      ]
    }
  ];

  // Helper component for Stamp icon (since it wasn't imported)
  const Stamp = () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="4" y="4" width="16" height="16" rx="2" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-900 to-indigo-900 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-5xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6">
            <FileText size={40} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Please read these terms carefully before using our services
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-50 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-12">
        <LastUpdated />

        {/* Agreement Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl flex-shrink-0">
              <Shield size={28} className="text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Agreement between User and Easy Esatmp</h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {sections.find(s => s.id === 'agreement')?.content}
              </p>
            </div>
          </div>
        </div>

        {/* Website Activities */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Layers size={24} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Website Activities</h2>
          </div>
          <p className="text-gray-700 mb-4 font-medium">While using the website easyesatmp.com you will have to do any or all of this:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {sections.find(s => s.id === 'website-activities')?.items.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                <CheckCircle size={16} className="text-green-500" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
            <p className="text-yellow-800 text-sm leading-relaxed">
              {sections.find(s => s.id === 'website-activities')?.note}
            </p>
          </div>
        </div>

        {/* Disclaimer of Lawyer-Client Relationship */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Briefcase size={24} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Disclaimer of Lawyer-Client Relationship</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'lawyer-relationship')?.content}
          </p>
        </div>

        {/* Relationship between Parties */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Users size={24} className="text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Relationship between Parties</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'relationship-parties')?.content}
          </p>
        </div>

        {/* Disclaimer for Orders */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              <FileSearch size={24} className="text-orange-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Disclaimer for the Orders</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'disclaimer-orders')?.content}
          </p>
        </div>

        {/* Disclaimer of Liability */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <AlertTriangle size={24} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Disclaimer of Liability</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'disclaimer-liability')?.content}
          </p>
        </div>

        {/* Not a Legal Advice */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-100 rounded-lg">
              <BookOpen size={24} className="text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Not a Legal Advice</h2>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {sections.find(s => s.id === 'not-legal-advice')?.content}
          </p>
        </div>

        {/* Name Change Package */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Award size={24} className="text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Disclaimer for Name Change Package Service</h2>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">
            {sections.find(s => s.id === 'name-change-package')?.content}
          </p>
          
          <div className="mb-4">
            <p className="font-semibold text-gray-800 mb-2">The stated timeline may be extended due to, but not limited to, the following reasons:</p>
            <div className="space-y-2">
              {sections.find(s => s.id === 'name-change-package')?.items.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-red-50 rounded-lg mb-4">
            <p className="text-red-700 text-sm">
              {sections.find(s => s.id === 'name-change-package')?.note}
            </p>
          </div>

          <div className="bg-green-50 rounded-lg p-4 mb-4">
            <p className="font-semibold text-green-800 mb-2">
              {sections.find(s => s.id === 'name-change-package')?.premiumContent?.title}
            </p>
            <div className="space-y-1">
              {sections.find(s => s.id === 'name-change-package')?.premiumContent?.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <CheckCircle size={14} className="text-green-600" />
                  <span className="text-green-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4 mb-4">
            <p className="font-semibold text-yellow-800 mb-2">
              {sections.find(s => s.id === 'name-change-package')?.disclaimer?.title}
            </p>
            <div className="space-y-1">
              {sections.find(s => s.id === 'name-change-package')?.disclaimer?.items.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <AlertTriangle size={14} className="text-yellow-600" />
                  <span className="text-yellow-700 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <p className="text-blue-800 text-sm">
              {sections.find(s => s.id === 'name-change-package')?.acknowledgement}
            </p>
          </div>
        </div>

        {/* General Information */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-cyan-100 rounded-lg">
              <HelpCircle size={24} className="text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">General Information to Common Man</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'general-info')?.content}
          </p>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <ShieldAlert size={24} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Limitation of Liability</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'limitation-liability')?.content}
          </p>
        </div>

        {/* Fees */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <CreditCard size={24} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Fees</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'fees')?.content}
          </p>
        </div>

        {/* Submissions/Approval */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-emerald-100 rounded-lg">
              <CheckCircle size={24} className="text-emerald-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Submissions/Approval</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'submissions')?.content}
          </p>
        </div>

        {/* Scan Copy Timeline */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock size={24} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Scan Copy Timeline</h2>
          </div>
          <div className="space-y-2">
            {sections.find(s => s.id === 'scan-timeline')?.items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                <Clock size={16} className="text-purple-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Disclaimer on Scan Copies */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Eye size={24} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Disclaimer on Scan Copies</h2>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {sections.find(s => s.id === 'disclaimer-scan')?.content}
          </p>
        </div>

        {/* Notarial Service */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Stamp size={20} className="text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Notarial Service</h2>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {sections.find(s => s.id === 'notarial-service')?.content}
          </p>
        </div>

        {/* Prohibited Use */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-100 rounded-lg">
              <Flag size={24} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Illegal, Unlawful, and Prohibited Use Banned</h2>
          </div>
          <p className="text-gray-700 mb-4">You are bound to Easy Esatmp as a user of its website easyesatmp.com not to use our website in the following ways:</p>
          <div className="space-y-2">
            {sections.find(s => s.id === 'prohibited-use')?.items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modifications */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Edit size={24} className="text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Modifications in Terms and Conditions</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'modifications')?.content}
          </p>
        </div>

        {/* Privacy */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Lock size={24} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Privacy</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'privacy')?.content}
          </p>
        </div>

        {/* Technical Errors */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Server size={24} className="text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Disclaimer from Damages due to Technical Errors</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'technical-errors')?.content}
          </p>
        </div>

        {/* Indemnification */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-pink-100 rounded-lg">
              <HeartHandshake size={24} className="text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Indemnification</h2>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {sections.find(s => s.id === 'indemnification')?.content}
          </p>
        </div>

        {/* Dispute Resolution */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-800 rounded-lg">
              <Gavel size={24} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Dispute Resolution By Binding Arbitration</h2>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {sections.find(s => s.id === 'dispute-resolution')?.content}
          </p>
        </div>

        {/* Cancellation and Refund */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-orange-100 rounded-lg">
              {/* <RefreshCw size={24} className="text-orange-600" /> */}
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Cancellation and Refund Policy</h2>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">
            {sections.find(s => s.id === 'cancellation-refund')?.content}
          </p>
          <p className="font-semibold text-gray-800 mb-2">Notwithstanding anything stated above, nothing in this Cancellation Policy shall be applicable to the following categories:-</p>
          <div className="space-y-2 mb-4">
            {sections.find(s => s.id === 'cancellation-refund')?.items.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <XCircle size={16} className="text-red-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700 text-sm">{item}</span>
              </div>
            ))}
          </div>
          <div className="p-3 bg-red-50 rounded-lg">
            <p className="text-red-700 text-sm">
              {sections.find(s => s.id === 'cancellation-refund')?.note}
            </p>
          </div>
        </div>

        {/* Delivery Policy */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-teal-100 rounded-lg">
              <Truck size={24} className="text-teal-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Delivery Policy</h2>
          </div>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line mb-4">
            {sections.find(s => s.id === 'delivery-policy')?.content}
          </p>
          
          <div className="mb-4">
            <p className="font-semibold text-gray-800 mb-2">In the case, if the delivery has not been done due to any reason whatsoever mentioned herein below, the customer shall not be entitled to claim for the refund/or in any other manner, and same shall not be processed by easyesatmp.com:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {sections.find(s => s.id === 'delivery-policy')?.nonRefundableEvents.map((event, idx) => (
                <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                  <AlertCircle size={14} className="text-orange-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-600 text-sm">{event}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-700 text-sm">
              {sections.find(s => s.id === 'delivery-policy')?.additionalNote}
            </p>
          </div>
        </div>

        {/* Third Party Links */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Link size={24} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Link to Other Websites and Linking Disclaimer</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'third-party-links')?.content}
          </p>
        </div>

        {/* Governing Law */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Scale size={24} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Governing Laws and Jurisdiction</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'governing-law')?.content}
          </p>
        </div>

        {/* Agreement to be Bound */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8 mb-8 border border-green-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <UserCheck size={24} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Agreement to be Bound</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'agreement-bound')?.content}
          </p>
        </div>

        {/* Copyright */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-100 rounded-lg">
              <Copy size={24} className="text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Copyrights And Intellectual Property Rights</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'copyright')?.content}
          </p>
        </div>

        {/* Assignment */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <Send size={24} className="text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Assignment</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'assignment')?.content}
          </p>
        </div>

        {/* Severability */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Layers size={24} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Severability</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'severability')?.content}
          </p>
        </div>

        {/* Headings */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-gray-100 rounded-lg">
              <FileText size={24} className="text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Headings</h2>
          </div>
          <p className="text-gray-700 leading-relaxed">
            {sections.find(s => s.id === 'headings')?.content}
          </p>
        </div>

        {/* Contact Information */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-8 mb-8 border border-blue-100">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Mail size={24} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
          </div>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Agreement or the Service, please contact Easy Esatmp at:
          </p>
          <div className="bg-white rounded-lg p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-blue-600" />
              <a href="mailto:info@easyesatmp.com" className="text-blue-600 hover:text-blue-800 font-medium">
                info@easyesatmp.com
              </a>
            </div>
            <div className="text-sm text-gray-500">
              Response within 24-48 hours
            </div>
          </div>
        </div>

        {/* General Conditions */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <AlertCircle size={24} className="text-gray-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">General Conditions</h2>
          </div>
          
          <div className="space-y-6">
            {sections.find(s => s.id === 'general-conditions')?.subsections.map((subsection, idx) => (
              <div key={idx} className="border-b border-gray-200 pb-4 last:border-0">
                <h3 className="font-semibold text-gray-800 mb-2">{subsection.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{subsection.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 mt-8 pt-8 border-t border-gray-200">
          <p>© {new Date().getFullYear()} Easy Esatmp. All rights reserved.</p>
          <p className="mt-1">These Terms and Conditions were last updated on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
}