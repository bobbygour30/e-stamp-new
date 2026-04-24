import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import AdminSidebar from '../components/AdminSidebar';
import Dashboard from './Dashboard';
import StampPaperOrders from '../components/StampPaperOrders';
import VendorManagement from '../components/VendorManagement';
import UploadStampPaper from '../components/UploadStampPaper';
import EmployeeManagement from '../components/EmployeeManagement';
import CreateEmployee from '../components/CreateEmployee';
import SecureDashboard from './SecureDashboard';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [permissions, setPermissions] = useState({});
  const [preselectedOrder, setPreselectedOrder] = useState(null);

  useEffect(() => {
    // Load employee permissions if user is employee
    if (user?.role === 'employee') {
      setPermissions(user.employeeDetails?.permissions || {});
    }
  }, [user]);

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
      case 'upload-stamp-paper':
        return <UploadStampPaper preselectedOrder={preselectedOrder} />;
      case 'employee-management':
        return <EmployeeManagement />;
      case 'create-employee':
        return <CreateEmployee onEmployeeCreated={() => setActiveTab('employee-management')} />;
      default:
        return <SecureDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        userRole={user?.role}
        permissions={permissions}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>
    </div>
  );
}