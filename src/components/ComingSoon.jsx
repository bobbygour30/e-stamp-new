import React from 'react';
import { Construction, Calendar } from 'lucide-react';

export default function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-96 text-center">
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-full p-8 mb-6">
        <Construction size={64} className="text-indigo-600" />
      </div>
      <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-4 max-w-md">
        We're working hard to bring you this feature. Stay tuned for updates!
      </p>
      <div className="flex items-center gap-2 text-indigo-600">
        <Calendar size={18} />
        <span className="text-sm">Coming Soon</span>
      </div>
    </div>
  );
}