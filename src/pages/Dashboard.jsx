import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { LogOut, User } from "lucide-react";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-white">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-semibold text-indigo-600">Auth App</h1>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <User size={32} className="text-indigo-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Welcome, {user?.name}!</h2>
              <p className="text-slate-600">{user?.email}</p>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Profile</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">User ID</p>
                <p className="font-medium text-slate-900">{user?._id}</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-lg">
                <p className="text-sm text-slate-600">Member Since</p>
                <p className="font-medium text-slate-900">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}