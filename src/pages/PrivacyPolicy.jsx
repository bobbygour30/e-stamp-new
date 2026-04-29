import React from 'react';
import { 
  Shield, 
  Lock, 
  Eye, 
  Database, 
  Cookie, 
  Mail, 
  AlertCircle,
  CheckCircle,
  ExternalLink,
  Users,
  CreditCard,
  Globe,
  FileText
} from 'lucide-react';

export default function PrivacyPolicy() {
  const sections = [
    {
      id: 'introduction',
      title: 'Introduction',
      icon: Shield,
      content: `Easy Esatmp knows the importance of maintaining your privacy. We value your privacy and appreciate your trust in us. When we collect data and use it on our website easyesatmp.com we exercise certain procedures and process and it is agreed by you that you allow to these exercises mentioned in this statement.
      
By visiting and/or using our website, you agree to this Privacy Policy.`
    },
    {
      id: 'information-collect',
      title: 'Information We Collect',
      icon: Database,
      subsections: [
        {
          title: 'Contact Information',
          icon: Users,
          content: 'We might collect your name, email address, phone number, office or residential address, name etc. whenever you purchase the services from Easyesatmp.com.'
        },
        {
          title: 'Payment and Billing Information',
          icon: CreditCard,
          content: 'We might collect your billing name, billing address and payment method when you buy our services. We never collect your credit card number or credit card expiry date or other details pertaining to your credit card on our website. Credit card information will be obtained and processed by our online payment partner who is protected by encryption, like Secure Socket Layer (SSL) protocol.'
        },
        {
          title: 'Other Information',
          icon: Globe,
          content: 'If you use our website, we may collect information about your IP address, browser type, domain names, other website addresses referred, access times etc. We might look at what site you came from, duration of time spent on our website, pages accessed or what site you visit when you leave us. Your use will be automatically collected by Easyesatmp.com and this information shall be used by Easyesatmp.com to operate and maintain the quality of service.'
        }
      ]
    },
    {
      id: 'data-protection',
      title: 'Data Protection',
      icon: Lock,
      content: `All the information collected from you by our website Easyesatmp.com shall be in our protected and safe hand.`
    },
    {
      id: 'disclaimer',
      title: 'Disclaimer and Non-liability from Public Disclosures',
      icon: AlertCircle,
      content: `Any personal information disclosed on our website can be used by others and hence you are not supposed to give any such information on the public platforms. Easyesatmp.com is not liable for any such disclosures made by you.

Easyesatmp.com is not responsible or liable for any personal disclosures made to any linked websites from Easyesatmp.com

We shall request you to register using your personal details. We shall use your personal information to send emails, messages or notices regarding our services and also to inform you of any other services available from Easyesatmp.com.

Easy Esatmp shall also contact you with your personal information to get feedback from you of our services and we also may conduct surveys regarding this.

Your information provided to us will never be shared with any third party unless such third parties are performing as part of our services to you. All third parties shall maintain confidentiality with respect to this.

Your personal information like religion, political affiliation, race etc will not be disclosed by Easy Esatmp without your express consent.

Your personal information shall be disclosed by Easy Esatmp if required by law to comply with legal procedures in the website or to protect the rights of Easyesatmp.com or to protect the rights and for personal safety of the users of Easyesatmp.com.`
    },
    {
      id: 'cookies',
      title: 'Use of Cookies',
      icon: Cookie,
      content: `We may add cookies to your computer in order to uniquely identify your browser and improve the quality of our service. "Cookies" refer to small pieces of information that a website sends to your computer's hard drive while you are viewing the Site. We enable some of our business partners to use cookies in conjunction with your use of the Site. We have no access to or control over the use of these cookies. These cookies collect information about your use of the Site. You can choose to disable or selectively turn off our cookies or third-party cookies in your browser settings. However, this can affect how you are able to interact with our site as well as other websites.`
    },
    {
      id: 'security',
      title: 'Security of Personal Data',
      icon: Lock,
      content: `Any information or password that you use to access the website Easyesatmp.com shall be prevented from any unauthorized use or hacking and it is your responsibility to do so. You shall not disclose your password details to any third party and shall notify Easy Esatmp in case of any such unauthorized use.

Easy Esatmp shall keep your personal information confidential and secured from unauthorized access.`
    },
    {
      id: 'third-party',
      title: 'Third Party Sites',
      icon: ExternalLink,
      content: `If you click on one of the links to third party websites, you may be taken to websites we do not control. This policy does not apply to the privacy practices of those websites. Read the privacy policy of other websites carefully. We are not responsible for these third party sites.`
    },
    {
      id: 'updates',
      title: 'Updates to the Privacy Policy',
      icon: FileText,
      content: `From time to time we may change our privacy policy. We will notify you of any material changes to this policy as required by law. We will also post an updated copy on our website. Please check our site periodically for updates.`
    },
    {
      id: 'acceptance',
      title: 'Acceptance of These Terms',
      icon: CheckCircle,
      content: `By using this website, you signify your acceptance of this policy. If you do not agree to this policy, please do not use our website. Your continued use of the website following the posting of changes to this policy will be deemed your acceptance of those changes.`
    },
    {
      id: 'contact',
      title: 'Contacting Us',
      icon: Mail,
      content: `If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, please contact us at info@easyesatmp.com.

If you have any questions about this Policy or other privacy concerns, you can contact us for further information.`
    }
  ];

  const LastUpdated = () => (
    <div className="bg-indigo-50 rounded-lg p-4 mb-8 text-center">
      <p className="text-indigo-800 text-sm">
        Last Updated: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-indigo-900 to-purple-900 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-white/10 rounded-full mb-6">
            <Shield size={40} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
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
            <div className="p-3 bg-indigo-100 rounded-xl">
              <Shield size={28} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
              <p className="text-gray-700 leading-relaxed">
                Easy Esatmp knows the importance of maintaining your privacy. We value your privacy and 
                appreciate your trust in us. When we collect data and use it on our website easyesatmp.com 
                we exercise certain procedures and process and it is agreed by you that you allow to these 
                exercises mentioned in this statement.
              </p>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg border-l-4 border-yellow-500">
                <p className="text-yellow-800">
                  <strong>Note:</strong> By visiting and/or using our website, you agree to this Privacy Policy.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Information We Collect Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Database size={24} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
          </div>
          
          <div className="space-y-6">
            {sections.find(s => s.id === 'information-collect')?.subsections.map((sub, idx) => (
              <div key={idx} className="border-l-4 border-indigo-300 pl-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <sub.icon size={18} className="text-indigo-600" />
                  {sub.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">{sub.content}</p>
              </div>
            ))}
          </div>
        </div>

        {/* All Other Sections */}
        {sections.filter(s => s.id !== 'introduction' && s.id !== 'information-collect').map((section) => (
          <div key={section.id} className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <section.icon size={24} className="text-purple-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
            </div>
            <div className="prose prose-indigo max-w-none">
              {section.content.split('\n\n').map((paragraph, idx) => (
                <p key={idx} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph.trim()}
                </p>
              ))}
            </div>
          </div>
        ))}

        {/* Contact Information Card */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-8 mb-8 border border-indigo-100">
          <div className="flex items-center gap-3 mb-4">
            <Mail size={28} className="text-indigo-600" />
            <h2 className="text-2xl font-bold text-gray-900">Have Questions?</h2>
          </div>
          <p className="text-gray-700 mb-4">
            If you have any questions about this Privacy Policy, the practices of this site, 
            or your dealings with this site, please contact us:
          </p>
          <div className="bg-white rounded-lg p-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <Mail size={18} className="text-indigo-600" />
              <a href="mailto:info@easyesatmp.com" className="text-indigo-600 hover:text-indigo-800 font-medium">
                info@easyesatmp.com
              </a>
            </div>
            <div className="text-sm text-gray-500">
              Response within 24-48 hours
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-center text-sm text-gray-500 mt-8 pt-8 border-t border-gray-200">
          <p>© {new Date().getFullYear()} Easy Esatmp. All rights reserved.</p>
          <p className="mt-1">This Privacy Policy was last updated on {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
        </div>
      </div>
    </div>
  );
}