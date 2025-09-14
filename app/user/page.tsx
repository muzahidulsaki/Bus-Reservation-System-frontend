"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";

// ✅ Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.timeout = 30000; // 30 seconds

// ✅ UPDATED API URL TO PORT 8080
const API_BASE_URL = "http://localhost:8080";

interface UserData {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  status: string;
}

interface DashboardData {
  totalBookings: number;
  recentBookings: any[];
  lastLoginTime: string;
}

interface ProfileEditData {
  fullName: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
}

export default function UserAuth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [user, setUser] = useState<UserData | null>(null);
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const router = useRouter();
  
  // Edit profile states
  const [isEditing, setIsEditing] = useState(false);
  const [editFormData, setEditFormData] = useState<ProfileEditData>({
    fullName: "",
    email: "",
    phone: "",
    age: 0,
    gender: "",
  });
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState<string | null>(null);
  

  // Login state
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  // Register state
  const [registerForm, setRegisterForm] = useState({
    fullName: "",
    email: "",
    age: "",
    password: "",
    confirmPassword: "",
  });
  const [nidImage, setNidImage] = useState<File | null>(null);

  // Check session on component mount
  useEffect(() => {
    checkSessionAndLoadData();
  }, []);

  const checkSessionAndLoadData = async () => {
    try {
      console.log("🔍 Checking user session...");
      
      // First check session
      const sessionResponse = await axios.get(`${API_BASE_URL}/user/check-session`);
      
      if (sessionResponse.data.isLoggedIn) {
        console.log("✅ Session active, loading dashboard...");
        
        // Load dashboard data
        const dashboardResponse = await axios.get(`${API_BASE_URL}/user/dashboard`);
        
        setUser(dashboardResponse.data.user);
        setDashboardData(dashboardResponse.data.dashboardData);
        
        // Initialize edit form with current user data
        const userData = dashboardResponse.data.user;
        if (userData) {
          setEditFormData({
            fullName: userData.fullName || "",
            email: userData.email || "",
            phone: userData.phone?.toString() || "",
            age: userData.age || 0,
            gender: userData.gender || "",
          });
        }
        
        console.log("✅ Dashboard loaded:", dashboardResponse.data);
      } else {
        console.log("❌ No active session");
        setUser(null);
        setDashboardData(null);
      }
    } catch (error: any) {
      console.error("❌ Session check error:", error);
      setUser(null);
      setDashboardData(null);
    } finally {
      setSessionLoading(false);
    }
  };

  // Input changes
  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({ ...loginForm, [e.target.name]: e.target.value });
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRegisterForm({ ...registerForm, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setNidImage(e.target.files[0]);
    }
  };

  // Validation
  const validateLogin = () => {
    if (!loginForm.email.trim()) {
      alert("Email is required!");
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
    if (!/^[A-Za-z\s]+$/.test(registerForm.fullName)) {
      alert("Name must contain only letters and spaces!");
      return false;
    }
    if (!/^\S+@\S+\.com$/.test(registerForm.email)) {
      alert("Email must end with .com domain!");
      return false;
    }
    if (!/^[0-9]+$/.test(registerForm.age)) {
      alert("Age must be a number!");
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
    if (!nidImage) {
      alert("NID Image is required!");
      return false;
    }
    
    const phoneInput = (document.getElementById("phone") as HTMLInputElement).value;
    const nidInput = (document.getElementById("nid") as HTMLInputElement).value;
    
    if (!/^01[0-9]{9}$/.test(phoneInput)) {
      alert("Phone must be a valid Bangladeshi number (01xxxxxxxxx)!");
      return false;
    }
    
    if (!/^\d{10,17}$/.test(nidInput)) {
      alert("NID must be between 10 to 17 digits!");
      return false;
    }
    
    return true;
  };

  // ✅ FIXED Login Submit with redirect
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateLogin()) return;

    setLoading(true);
    try {
      console.log("🔐 Attempting login...");
      
      const response = await axios.post(
        `${API_BASE_URL}/user/login`,
        {
          email: loginForm.email.trim(),
          password: loginForm.password,
        }
      );
      
      console.log("✅ Login Response:", response.data);
      
      alert(`✅ Login successful!\nWelcome back ${response.data.user?.fullName || 'User'}!`);
      
      // Reload session data after successful login
      await checkSessionAndLoadData();
      
      // Clear login form
      setLoginForm({ email: "", password: "" });
      
    } catch (error: any) {
      console.error("❌ Login Error:", error);
      
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

  // ✅ FIXED Registration Submit
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateRegister()) return;

    setLoading(true);
    try {
      const formData = new FormData();
      
      formData.append("fullName", registerForm.fullName.trim());
      formData.append("email", registerForm.email.trim());
      formData.append("age", registerForm.age);
      formData.append("password", registerForm.password);

      const phoneInput = (document.getElementById("phone") as HTMLInputElement).value;
      const genderSelect = (document.querySelector("select[name='gender']") as HTMLSelectElement).value;
      const nidInput = (document.getElementById("nid") as HTMLInputElement).value;

      formData.append("phone", phoneInput.trim());
      formData.append("gender", genderSelect);
      formData.append("nid", nidInput.trim());

      if (nidImage) {
        formData.append("nid_image", nidImage);
      }

      console.log("🚀 Sending registration data...");

      const response = await axios.post(
        `${API_BASE_URL}/user/register`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("✅ Registration Response:", response.data);
      
      alert(`✅ Registration successful!\nWelcome ${response.data.data?.fullName || 'User'}!\nPlease login with your credentials.`);
      
      // Clear form
      setRegisterForm({
        fullName: "",
        email: "",
        age: "",
        password: "",
        confirmPassword: "",
      });
      setNidImage(null);
      
      // Clear DOM fields
      (document.getElementById("phone") as HTMLInputElement).value = "";
      (document.getElementById("nid") as HTMLInputElement).value = "";
      (document.getElementById("nid_image") as HTMLInputElement).value = "";
      
      setIsLogin(true);
      
    } catch (error: any) {
      console.error("❌ Registration Error:", error);
      
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
      console.log("🔐 Logging out...");
      
      await axios.post(`${API_BASE_URL}/user/logout`);
      
      console.log("✅ Logout successful");
      
      // Clear local state
      setUser(null);
      setDashboardData(null);
      
      alert("✅ Logged out successfully!");
      
    } catch (error: any) {
      console.error("❌ Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  // Edit profile functions
  const handleEditProfile = () => {
    console.log("✏️ Enabling edit mode");
    setIsEditing(true);
    setSaveMessage(null);
  };

  const handleCancelEdit = () => {
    console.log("❌ Canceling edit mode");
    setIsEditing(false);
    setSaveMessage(null);
    // Reset form data to original user data
    if (user) {
      setEditFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone?.toString() || "",
        age: user.age || 0,
        gender: user.gender || "",
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    console.log("📝 Input change:", name, value);
    setEditFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  const handleSaveProfile = async () => {
    setSaveLoading(true);
    setSaveMessage(null);
    
    try {
      console.log("💾 Saving profile updates...", editFormData);
      
      const response = await axios.put(`${API_BASE_URL}/user/my-profile/update`, editFormData);
      
      console.log("💾 Save response:", response.data);
      
      if (response.data.success) {
        // Update local user state
        setUser(response.data.user);
        setIsEditing(false);
        setSaveMessage("✅ Profile updated successfully!");
        
        console.log("✅ Profile updated:", response.data);
        
        // Clear success message after 3 seconds
        setTimeout(() => setSaveMessage(null), 3000);
      } else {
        setSaveMessage("❌ Failed to update profile");
      }
      
    } catch (error: any) {
      console.error("❌ Profile update error:", error);
      
      if (error.response?.data?.message) {
        setSaveMessage(`❌ ${error.response.data.message}`);
      } else {
        setSaveMessage("❌ Failed to update profile. Please try again.");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  // Show loading while checking session
  if (sessionLoading) {
    return (
      <div>
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-xl text-gray-600">Checking session...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // If user is logged in, show dashboard
  if (user && dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                   Welcome back, {user.fullName}!
                </h1>
                <p className="text-gray-600">
                  Manage your bus bookings and account settings
                </p>
              </div>
              {/* <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition duration-300"
              >
                🚪 Logout
              </button> */}
            </div>
          </div>

          {/* Dashboard Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {dashboardData.totalBookings || 0}
              </div>
              <div className="text-gray-600">Total Bookings</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">
                {user.status === 'active' ? '✅' : '❌'}
              </div>
              <div className="text-gray-600">Account Status</div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">
                📅
              </div>
              <div className="text-gray-600">Last Login</div>
              <div className="text-sm text-gray-500 mt-1">
                {dashboardData.lastLoginTime ? new Date(dashboardData.lastLoginTime).toLocaleString() : 'Now'}
              </div>
            </div>
          </div>

          {/* User Information - Editable */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">👤 Your Information</h2>
              
              {!isEditing ? (
                <button
                  onClick={handleEditProfile}
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center gap-2"
                >
                  ✏️ Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saveLoading}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition duration-300 disabled:opacity-50 flex items-center gap-2"
                  >
                    {saveLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Saving...
                      </>
                    ) : (
                      <>💾 Save</>
                    )}
                  </button>
                  <button
                    onClick={handleCancelEdit}
                    disabled={saveLoading}
                    className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition duration-300 disabled:opacity-50"
                  >
                    ❌ Cancel
                  </button>
                </div>
              )}
            </div>
            
            {saveMessage && (
              <div className={`mb-4 p-3 rounded-lg text-sm ${
                saveMessage.includes("✅") 
                  ? "bg-green-100 text-green-700" 
                  : "bg-red-100 text-red-700"
              }`}>
                {saveMessage}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="fullName"
                    value={editFormData.fullName}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg text-gray-800">{user.fullName}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg text-gray-800">{user.email}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Phone</label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                    placeholder="Enter your phone number"
                  />
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg text-gray-800">{user.phone}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Age</label>
                {isEditing ? (
                  <input
                    type="number"
                    name="age"
                    value={editFormData.age}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                  />
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg text-gray-800">{user.age}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Gender</label>
                {isEditing ? (
                  <select
                    name="gender"
                    value={editFormData.gender}
                    onChange={handleInputChange}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                  </select>
                ) : (
                  <div className="bg-gray-50 p-3 rounded-lg capitalize text-gray-800">{user.gender}</div>
                )}
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Status</label>
                <div className={`p-3 rounded-lg font-medium ${
                  user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {user.status === 'active' ? '✅ Active' : '❌ Inactive'}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">🚀 Quick Actions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={() => router.push('/booking')}
                className="bg-blue-500 text-white p-4 rounded-lg hover:bg-blue-600 transition duration-300 text-center"
              >
                🎫 Book New Ticket
              </button>
              
              <button 
                onClick={() => router.push('/my-bookings')}
                className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition duration-300 text-center"
              >
                📋 My Bookings
              </button>
              
              <button 
                onClick={() => router.push('/profile')}
                className="bg-purple-500 text-white p-4 rounded-lg hover:bg-purple-600 transition duration-300 text-center"
              >
                ⚙️ Account Settings
              </button>
            </div>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">📋 Recent Bookings</h2>
            
            {dashboardData.recentBookings && dashboardData.recentBookings.length > 0 ? (
              <div className="space-y-4">
                {dashboardData.recentBookings.map((booking, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Booking #{booking.id}</div>
                        <div className="text-gray-600">{booking.route}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-medium text-green-600">{booking.status}</div>
                        <div className="text-gray-600">{booking.date}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-4">📝 No bookings yet</div>
                <p className="text-gray-600">Your recent bookings will appear here</p>
                <button 
                  onClick={() => router.push('/booking')}
                  className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition duration-300"
                >
                  Book Your First Ticket
                </button>
              </div>
            )}
          </div>
        </main>
        
        <Footer />
      </div>
    );
  }

  // If not logged in, show login/register form
  return (
    <div>
      <Header />
      <main className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              {isLogin ? "Sign in to your account" : "Create your account"}
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              🚌 Bus Reservation System - Server: {API_BASE_URL}
            </p>
          </div>

          {isLogin ? (
            // ✅ Login Form
            <form className="mt-8 space-y-6" onSubmit={handleLoginSubmit}>
              <div className="space-y-4">
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email address"
                  value={loginForm.email}
                  onChange={handleLoginChange}
                  disabled={loading}
                  className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 text-black disabled:opacity-50"
                />
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password"
                  value={loginForm.password}
                  onChange={handleLoginChange}
                  disabled={loading}
                  className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 text-black disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Don&apos;t have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
                  >
                    Register
                  </button>
                </p>
              </div>
            </form>
          ) : (
            // ✅ Registration Form (same as before)
            <form className="mt-8 space-y-6" onSubmit={handleRegisterSubmit}>
              <div className="space-y-4">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  placeholder="Full Name"
                  value={registerForm.fullName}
                  onChange={handleRegisterChange}
                  disabled={loading}
                  className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 text-black disabled:opacity-50"
                />
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  required
                  placeholder="Email Address (.com domain required)"
                  value={registerForm.email}
                  onChange={handleRegisterChange}
                  disabled={loading}
                  className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 text-black disabled:opacity-50"
                />
                <input
                  id="age"
                  name="age"
                  type="text"
                  required
                  placeholder="Age"
                  value={registerForm.age}
                  onChange={handleRegisterChange}
                  disabled={loading}
                  className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 text-black disabled:opacity-50"
                />
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  required
                  placeholder="Password (6+ chars, 1 uppercase)"
                  value={registerForm.password}
                  onChange={handleRegisterChange}
                  disabled={loading}
                  className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 text-black disabled:opacity-50"
                />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Confirm Password"
                  value={registerForm.confirmPassword}
                  onChange={handleRegisterChange}
                  disabled={loading}
                  className="relative block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 text-black disabled:opacity-50"
                />
                <input
                  type="text"
                  id="phone"
                  name="phone"
                  placeholder="Phone (01xxxxxxxxx)"
                  required
                  disabled={loading}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 text-black disabled:opacity-50"
                />
                <select
                  name="gender"
                  disabled={loading}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md text-black disabled:opacity-50"
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
                <input
                  type="text"
                  id="nid"
                  name="nid"
                  placeholder="NID Number (10-17 digits)"
                  required
                  disabled={loading}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-600 text-black disabled:opacity-50"
                />
                <label
                  htmlFor="nid_image"
                  className="block text-sm font-medium text-gray-700"
                >
                  Upload your NID Image (Max 2MB)
                </label>
                <input
                  id="nid_image"
                  name="nid_image"
                  type="file"
                  accept="image/*"
                  required
                  onChange={handleFileChange}
                  disabled={loading}
                  className="block w-full text-sm text-gray-600 border border-gray-400 rounded-md disabled:opacity-50"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Registering..." : "Register"}
              </button>
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    disabled={loading}
                    className="text-indigo-600 hover:text-indigo-500 disabled:opacity-50"
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