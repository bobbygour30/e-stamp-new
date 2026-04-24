import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingCart, 
  Users, 
  Upload, 
  LogOut,
  UserPlus,
  Truck,
  Briefcase,
  UserCog,
  LayoutDashboard,
  BarChart3
} from 'lucide-react';

export default function AdminSidebar({ activeTab, onTabChange, userRole, permissions }) {
  const navigate = useNavigate();

  const menuItems = [
     {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    description: 'View analytics and stats',
    requiredPermission: 'dashboard'
  },
    {
      id: 'stamp-paper-orders',
      label: 'Stamp Paper Orders',
      icon: ShoppingCart,
      description: 'View and manage orders',
      requiredPermission: 'stampPaperOrders'
    },
    {
      id: 'vendor-management',
      label: 'Vendor Management',
      icon: Users,
      description: 'Manage existing vendors',
      requiredPermission: 'vendorManagement'
    },
    {
      id: 'upload-stamp-paper',
      label: 'Upload Stamp Paper',
      icon: Upload,
      description: 'Upload stamp paper inventory',
      requiredPermission: 'uploadStampPaper'
    },
    {
      id: 'employee-management',
      label: 'Employee Management',
      icon: Briefcase,
      description: 'Manage employees',
      requiredPermission: 'employeeManagement'
    },
    {
      id: 'create-employee',
      label: 'Create Employee',
      icon: UserCog,
      description: 'Register new employee',
      requiredPermission: 'createEmployee'
    },
    {
  id: 'reports',
  label: 'Reports & Analytics',
  icon: BarChart3,
  description: 'View insights and analytics',
  requiredPermission: 'reports'
},
  ];

  // Filter menu items based on user role and permissions
  const visibleMenuItems = userRole === 'admin' 
    ? menuItems 
    : menuItems.filter(item => permissions?.[item.requiredPermission]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="w-64 bg-gradient-to-b from-indigo-900 to-purple-900 text-white flex flex-col shadow-xl">
      {/* Logo Section */}
      <div className="p-6 border-b border-indigo-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
            <Truck size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold">LexDraft</h2>
            <p className="text-xs text-indigo-300">
              {userRole === 'admin' ? 'Admin Portal' : 'Employee Portal'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        <div className="px-4 mb-4">
          <p className="text-xs text-indigo-300 uppercase tracking-wider">Main Menu</p>
        </div>
        
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center gap-3 px-6 py-3 transition-all duration-200 ${
                isActive 
                  ? 'bg-indigo-800 border-l-4 border-indigo-400 text-white' 
                  : 'text-indigo-200 hover:bg-indigo-800 hover:text-white'
              }`}
            >
              <Icon size={20} />
              <div className="flex-1 text-left">
                <p className="text-sm font-medium">{item.label}</p>
                <p className="text-xs opacity-75">{item.description}</p>
              </div>
            </button>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-indigo-800">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 text-indigo-200 hover:bg-indigo-800 hover:text-white rounded-lg transition"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
}