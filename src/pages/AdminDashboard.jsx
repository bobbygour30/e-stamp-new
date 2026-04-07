import React, { useState } from 'react';
import AdminSidebar from '../components/AdminSidebar';
import StampPaperOrders from '../components/StampPaperOrders';
import VendorManagement from '../components/VendorManagement';
import CreateVendor from '../components/CreateVendor';
import UploadStampPaper from '../components/UploadStampPaper';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stamp-paper-orders');
  const [preselectedOrder, setPreselectedOrder] = useState(null);

  const handleUploadClick = (order) => {
    setPreselectedOrder(order);
    setActiveTab('upload-stamp-paper');
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'stamp-paper-orders':
        return <StampPaperOrders onUploadClick={handleUploadClick} />;
      case 'vendor-management':
        return <VendorManagement />;
      case 'create-vendor':
        return <CreateVendor onVendorCreated={() => setActiveTab('vendor-management')} />;
      case 'upload-stamp-paper':
        return <UploadStampPaper preselectedOrder={preselectedOrder} />;
      default:
        return <StampPaperOrders onUploadClick={handleUploadClick} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}