"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

// ✅ Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000;

const API_BASE_URL = "http://localhost:8080";

interface AdminData {
  id: number;
  fullName: string;
  email: string;
  position: string;
  status: string;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  status: 'active' | 'inactive';
}

interface DashboardData {
  totalUsers: number;
  totalAdmins: number;
  activeUsers: number;
  activeAdmins: number;
  recentUsers: User[];
  recentAdmins: any[];
  systemStats: {
    userGrowthRate: string;
    adminActiveRate: string;
    systemUptime: string;
  };
  lastLoginTime: string;
}

export default function CounterAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [admin, setAdmin] = useState<AdminData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentView, setCurrentView] = useState<'dashboard' | 'users' | 'profile'>('dashboard');
  const router = useRouter();

  // Login state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // Register state
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    counterLocation: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  // Check session on component mount
  useEffect(() => {
    checkSessionAndLoadData();
  }, []);

  const checkSessionAndLoadData = async () => {
    try {
      console.log("🔍 Checking admin session...");
      
      // First check session
      const sessionResponse = await axios.get(`${API_BASE_URL}/admin/check-session`);
      
      if (sessionResponse.data.isLoggedIn) {
        console.log("✅ Admin session active, loading dashboard...");
        
        // Load dashboard data
        const dashboardResponse = await axios.get(`${API_BASE_URL}/admin/dashboard`);
        
        setAdmin(dashboardResponse.data.admin);
        setDashboardData(dashboardResponse.data.dashboardData);
        
        console.log("✅ Admin dashboard loaded:", dashboardResponse.data);
      } else {
        console.log("❌ No active admin session");
        setAdmin(null);
        setDashboardData(null);
      }
    } catch (error: any) {
      console.error("❌ Admin session check error:", error);
      setAdmin(null);
      setDashboardData(null);
    } finally {
      setSessionLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users`);
      setUsers(response.data.users);
      console.log("✅ Users loaded:", response.data.users.length);
    } catch (error) {
      console.error("❌ Failed to load users:", error);
      alert("Failed to load users");
    }
  };

  const updateUserStatus = async (userId: number, status: 'active' | 'inactive') => {
    try {
      await axios.patch(`${API_BASE_URL}/admin/users/${userId}/status`, { status });
      
      // Update local state
      setUsers(users.map(user => 
        user.id === userId ? { ...user, status } : user
      ));
      
      alert(`✅ User status updated to ${status}`);
      setShowUserModal(false);
    } catch (error) {
      console.error("❌ Failed to update user status:", error);
      alert("Failed to update user status");
    }
  };

  // Input changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  // Validation functions (same as your original code)
  const validateLogin = () => {
    if (!loginForm.email.trim()) {
      alert("Email is required!");
      return false;
    }
    if (!/^\S+@\S+\.\S+$/.test(loginForm.email)) {
      alert("Invalid email format!");
      return false;
    }
    if (!loginForm.password.trim()) {
      alert("Password is required!");
      return false;
    }
    if (loginForm.password.length < 6) {
      alert("Password must be at least 6 characters!");
      return false;
    }
    return true;
  };

  const validateRegister = () => {
    if (!/^[A-Za-z\s]+$/.test(registerForm.name)) {
      alert("Name must contain only letters and spaces!");
      return false;
    }
    if (!/^\S+@\S+\.com$/.test(registerForm.email)) {
      alert("Email must end with .com domain!");
      return false;
    }
    if (registerForm.counterLocation.trim().length < 3) {
      alert("Counter location must be at least 3 characters!");
      return false;
    }
    if (!/^01[0-9]{9}$/.test(registerForm.phone)) {
      alert("Phone must be a valid Bangladeshi number (01xxxxxxxxx)!");
      return false;
    }
    if (registerForm.password.length < 6) {
      alert("Password must be at least 6 characters!");
      return false;
    }
    if (!/(?=.*[A-Z])/.test(registerForm.password)) {
      alert("Password must contain at least one uppercase letter!");
      return false;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      alert("Passwords do not match!");
      return false;
    }
    return true;
  };

  // ✅ UPDATED Admin Login Submit with session reload
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setLoading(true);
    try {
      console.log("🔐 Attempting admin login...");
      
      const response = await axios.post(
        `${API_BASE_URL}/admin/login`,
        {
          email: loginForm.email.trim(),
          password: loginForm.password,
        }
      );
      
      console.log("✅ Admin Login Response:", response.data);
      
      alert(`✅ Admin login successful!\nWelcome back ${response.data.admin?.fullName || 'Admin'}!`);
      
      // ✅ Reload session data after successful login
      await checkSessionAndLoadData();
      
      // Clear login form
      setLoginForm({ email: "", password: "" });
      
    } catch (error: any) {
      console.error("❌ Admin Login Error:", error);
      
      if (error.response?.data?.message) {
        alert(`❌ Login Failed: ${error.response.data.message}`);
      } else if (error.response?.status === 401) {
        alert("❌ Invalid email or password. Please check your credentials.");
      } else if (error.code === 'ECONNABORTED') {
        alert("❌ Request timeout. Please try again.");
      } else if (error.code === 'ERR_NETWORK') {
        alert("❌ Network error. Please check if the server is running on port 8080.");
      } else {
        alert("❌ Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // ✅ Admin Registration Submit (same as original)
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setLoading(true);
    try {
      console.log("🚀 Attempting admin registration...");
      
      const { confirmPassword, ...registerData } = registerForm;
      
      const response = await axios.post(
        `${API_BASE_URL}/admin/register`,
        {
          name: registerData.name.trim(),
          email: registerData.email.trim(),
          counterLocation: registerData.counterLocation.trim(),
          phone: registerData.phone.trim(),
          password: registerData.password,
        }
      );
      
      console.log("✅ Admin Registration Response:", response.data);
      
      alert(`✅ Admin registration successful!\nWelcome ${response.data.data?.name || 'Admin'}!\nPlease login with your credentials.`);
      
      // Clear form
      setRegisterForm({
        name: "",
        email: "",
        counterLocation: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      
      setIsLogin(true); // Switch to login after successful registration
      
    } catch (error: any) {
      console.error("❌ Admin Registration Error:", error);
      
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        const errorText = Array.isArray(errorMessage) ? errorMessage.join(', ') : errorMessage;
        alert(`❌ Registration Failed: ${errorText}`);
      } else if (error.response?.status === 400) {
        alert("❌ Invalid registration data. Please check all fields.");
      } else if (error.code === 'ECONNABORTED') {
        alert("❌ Request timeout. Please try again.");
      } else if (error.code === 'ERR_NETWORK') {
        alert("❌ Network error. Please check if the server is running on port 8080.");
      } else {
        alert("❌ Registration failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      console.log("🔐 Admin logging out...");
      
      await axios.post(`${API_BASE_URL}/admin/logout`);
      
      console.log("✅ Admin logout successful");
      
      // Clear local state
      setAdmin(null);
      setDashboardData(null);
      setUsers([]);
      setCurrentView('dashboard');
      
      alert("✅ Logged out successfully!");
      
    } catch (error: any) {
      console.error("❌ Admin logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  // Show loading while checking session
  if (sessionLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white mx-auto mb-4"></div>
            <p className="text-xl">Checking admin session...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ✅ If admin is logged in, show dashboard
  if (admin && dashboardData) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        
        {/* Admin Navigation */}
        <nav className="bg-gray-900 border-b border-gray-700">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center py-4">
              <div className="flex space-x-6">
                <button
                  onClick={() => setCurrentView('dashboard')}
                  className={`px-4 py-2 rounded ${currentView === 'dashboard' ? 'bg-white text-black' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  📊 Dashboard
                </button>
                <button
                  onClick={() => {
                    setCurrentView('users');
                    loadUsers();
                  }}
                  className={`px-4 py-2 rounded ${currentView === 'users' ? 'bg-white text-black' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  👥 Manage Users
                </button>
                <button
                  onClick={() => setCurrentView('profile')}
                  className={`px-4 py-2 rounded ${currentView === 'profile' ? 'bg-white text-black' : 'bg-gray-700 hover:bg-gray-600'}`}
                >
                  👤 Profile
                </button>
              </div>
              
              {/* <div className="flex items-center space-x-4">
                <span className="text-gray-300">Welcome, {admin.fullName}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition duration-300"
                >
                  🚪 Logout
                </button>
              </div> */}
            </div>
          </div>
        </nav>
        
        <main className="container mx-auto px-4 py-8">
          {/* Dashboard View */}
          {currentView === 'dashboard' && (
            <>
              {/* Welcome Section */}
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8">
                <h1 className="text-3xl font-bold mb-2">
                  🔧 Admin Control Panel
                </h1>
                <p className="text-gray-300">
                  Manage users, view statistics, and control system settings
                </p>
                <div className="mt-4 text-sm text-gray-400">
                  Position: {admin.position} | Status: {admin.status}
                </div>
              </div>

              {/* Dashboard Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">
                    {dashboardData.totalUsers}
                  </div>
                  <div className="text-gray-300">Total Users</div>
                  <div className="text-sm text-green-400 mt-1">
                    {dashboardData.activeUsers} active
                  </div>
                </div>
                
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-green-400 mb-2">
                    {dashboardData.totalAdmins}
                  </div>
                  <div className="text-gray-300">Total Admins</div>
                  <div className="text-sm text-blue-400 mt-1">
                    {dashboardData.activeAdmins} active
                  </div>
                </div>
                
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-purple-400 mb-2">
                    {dashboardData.systemStats.userGrowthRate}
                  </div>
                  <div className="text-gray-300">User Growth</div>
                  <div className="text-sm text-gray-400 mt-1">This month</div>
                </div>
                
                <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">
                    {dashboardData.systemStats.systemUptime}
                  </div>
                  <div className="text-gray-300">System Uptime</div>
                  <div className="text-sm text-gray-400 mt-1">Last 30 days</div>
                </div>
              </div>

              {/* Recent Users */}
              <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
                <h2 className="text-2xl font-bold mb-6">📋 Recent Users</h2>
                
                {dashboardData.recentUsers && dashboardData.recentUsers.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-700">
                          <th className="text-left py-3 px-4">ID</th>
                          <th className="text-left py-3 px-4">Name</th>
                          <th className="text-left py-3 px-4">Email</th>
                          <th className="text-left py-3 px-4">Phone</th>
                          <th className="text-left py-3 px-4">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboardData.recentUsers.map((user, index) => (
                          <tr key={index} className="border-b border-gray-800 hover:bg-gray-800">
                            <td className="py-3 px-4">{user.id}</td>
                            <td className="py-3 px-4">{user.fullName}</td>
                            <td className="py-3 px-4 text-gray-300">{user.email}</td>
                            <td className="py-3 px-4 text-gray-300">{user.phone}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 rounded text-xs ${
                                user.status === 'active' 
                                  ? 'bg-green-900 text-green-300' 
                                  : 'bg-red-900 text-red-300'
                              }`}>
                                {user.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-gray-400 text-lg mb-4">📝 No recent users</div>
                    <p className="text-gray-500">Recent user registrations will appear here</p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Users Management View */}
          {currentView === 'users' && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">👥 User Management</h2>
                <button
                  onClick={loadUsers}
                  className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition duration-300"
                >
                  🔄 Refresh
                </button>
              </div>
              
              {users.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="text-left py-3 px-4">ID</th>
                        <th className="text-left py-3 px-4">Name</th>
                        <th className="text-left py-3 px-4">Email</th>
                        <th className="text-left py-3 px-4">Phone</th>
                        <th className="text-left py-3 px-4">Age</th>
                        <th className="text-left py-3 px-4">Gender</th>
                        <th className="text-left py-3 px-4">Status</th>
                        <th className="text-left py-3 px-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-800 hover:bg-gray-800">
                          <td className="py-3 px-4">{user.id}</td>
                          <td className="py-3 px-4">{user.fullName}</td>
                          <td className="py-3 px-4 text-gray-300">{user.email}</td>
                          <td className="py-3 px-4 text-gray-300">{user.phone}</td>
                          <td className="py-3 px-4">{user.age}</td>
                          <td className="py-3 px-4 capitalize">{user.gender}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs ${
                              user.status === 'active' 
                                ? 'bg-green-900 text-green-300' 
                                : 'bg-red-900 text-red-300'
                            }`}>
                              {user.status}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => {
                                setSelectedUser(user);
                                setShowUserModal(true);
                              }}
                              className="bg-yellow-600 hover:bg-yellow-700 px-3 py-1 rounded text-xs transition duration-300"
                            >
                              ✏️ Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-lg mb-4">👥 No users found</div>
                  <button
                    onClick={loadUsers}
                    className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded transition duration-300"
                  >
                    Load Users
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Profile View */}
          {currentView === 'profile' && (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-6">👤 Admin Profile</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                  <div className="bg-gray-800 border border-gray-600 p-3 rounded-lg">{admin.fullName}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                  <div className="bg-gray-800 border border-gray-600 p-3 rounded-lg">{admin.email}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
                  <div className="bg-gray-800 border border-gray-600 p-3 rounded-lg">{admin.position}</div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Status</label>
                  <div className={`p-3 rounded-lg font-medium ${
                    admin.status === 'active' ? 'bg-green-900 text-green-300 border border-green-700' : 'bg-red-900 text-red-300 border border-red-700'
                  }`}>
                    {admin.status === 'active' ? '✅ Active' : '❌ Inactive'}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* User Edit Modal */}
        {showUserModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 w-96">
              <h3 className="text-xl font-bold mb-4">Edit User: {selectedUser.fullName}</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Current Status</label>
                  <div className={`p-2 rounded ${
                    selectedUser.status === 'active' ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                  }`}>
                    {selectedUser.status}
                  </div>
                </div>
                
                <div className="flex space-x-4">
                  <button
                    onClick={() => updateUserStatus(selectedUser.id, 'active')}
                    disabled={selectedUser.status === 'active'}
                    className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded transition duration-300"
                  >
                    ✅ Activate
                  </button>
                  
                  <button
                    onClick={() => updateUserStatus(selectedUser.id, 'inactive')}
                    disabled={selectedUser.status === 'inactive'}
                    className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed px-4 py-2 rounded transition duration-300"
                  >
                    ❌ Deactivate
                  </button>
                </div>
                
                <button
                  onClick={() => setShowUserModal(false)}
                  className="w-full bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded transition duration-300 mt-4"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
        
        <Footer />
      </div>
    );
  }

  // ✅ If not logged in, show login/register form (your original forms with black theme)
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold">
              {isLogin ? "Counter Admin Login" : "Counter Admin Registration"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-400">
              🚌 Bus Reservation System - Server: {API_BASE_URL}
            </p>
            <p className="text-center text-sm text-gray-400">
              {isLogin ? "Sign in to your admin account" : "Create your admin account"}
            </p>
          </div>

          {/* Your original login and register forms but with black theme styling */}
          {isLogin ? (
            // ✅ Admin Login Form (black theme)
            <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Admin email address"
                    value={loginForm.email}
                    onChange={handleLoginChange}
                    disabled={loading}
                    className="relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-white focus:border-white disabled:opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Password"
                    value={loginForm.password}
                    onChange={handleLoginChange}
                    disabled={loading}
                    className="relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-white focus:border-white disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Signing in..." : "Admin Sign in"}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Don&apos;t have an admin account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    disabled={loading}
                    className="font-medium text-white hover:text-gray-300 disabled:opacity-50"
                  >
                    Register
                  </button>
                </p>
              </div>
            </form>
          ) : (
            // ✅ Admin Registration Form (black theme)
            <form className="mt-8 space-y-6" onSubmit={handleRegisterSubmit}>
              <div className="space-y-4">
                {/* Registration form fields with black theme styling */}
                <div>
                  <label htmlFor="name" className="sr-only">Name</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Admin Full Name"
                    value={registerForm.name}
                    onChange={handleRegisterChange}
                    disabled={loading}
                    className="relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-white focus:border-white disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="sr-only">Email address</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="Admin email address (.com domain required)"
                    value={registerForm.email}
                    onChange={handleRegisterChange}
                    disabled={loading}
                    className="relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-white focus:border-white disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label htmlFor="counterLocation" className="sr-only">Counter Location</label>
                  <input
                    id="counterLocation"
                    name="counterLocation"
                    type="text"
                    required
                    placeholder="Counter Location (e.g., Dhaka, Chittagong)"
                    value={registerForm.counterLocation}
                    onChange={handleRegisterChange}
                    disabled={loading}
                    className="relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-white focus:border-white disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label htmlFor="phone" className="sr-only">Phone</label>
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    required
                    placeholder="Phone (01xxxxxxxxx)"
                    value={registerForm.phone}
                    onChange={handleRegisterChange}
                    disabled={loading}
                    className="block w-full px-3 py-2 border border-gray-600 bg-gray-800 placeholder-gray-400 text-white rounded-md disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="sr-only">Password</label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="Password (6+ chars, 1 uppercase)"
                    value={registerForm.password}
                    onChange={handleRegisterChange}
                    disabled={loading}
                    className="relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-white focus:border-white disabled:opacity-50"
                  />
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="sr-only">Confirm Password</label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    placeholder="Confirm password"
                    value={registerForm.confirmPassword}
                    onChange={handleRegisterChange}
                    disabled={loading}
                    className="relative block w-full px-3 py-2 border border-gray-600 bg-gray-800 placeholder-gray-400 text-white rounded-md focus:outline-none focus:ring-white focus:border-white disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-black bg-white hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Registering..." : "Register Admin"}
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-400">
                  Already have an admin account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    disabled={loading}
                    className="font-medium text-white hover:text-gray-300 disabled:opacity-50"
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}