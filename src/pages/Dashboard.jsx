import React, { useEffect, useState } from "react";
import { FaSignOutAlt } from "react-icons/fa";
import ProjectDashboard from "../components/ProjectDashboard";
import BlogDashboard from "../components/BlogDashboard";
import Home from "../components/Home";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import InquiryDashboard from "../components/InqueryDashboard";
import GalleryDashboard from "../components/GalleryDashboard";
import cclogo from '../assets/ccogo-suhel.webp';
import {
  BadgeInfo,
  FolderOpenDot,
  House,
  Images,
  MailQuestion,
  Menu,
  Rss,
  User,
  ChevronRight,
  Bell,
  Search,
  X,
  LogOut,
  ChevronDown,
  Settings,
  HelpCircle,
  BarChart2
} from "lucide-react";
import ApplicationDashboard from "../components/ApplicationDashboard";
import CopyRight from "../components/CopyRight";

const SidebarItem = ({ name, icon, active, onClick, collapsed }) => {
  return (
    <div
      className={`flex items-center ${active ? 'bg-[#ebb661] text-white' : 'text-neutral-300 hover:bg-neutral-700'} rounded-lg cursor-pointer transition-all duration-200 mb-0.5 px-2 py-2 group`}
      onClick={() => onClick(name)}
    >
      <div className={`${active ? 'text-white' : 'text-neutral-400 group-hover:text-white'} mr-3 transition-colors`}>{icon}</div>
      {!collapsed && (
        <span className="font-medium">{name}</span>
      )}
      {!collapsed && active && (
        <ChevronRight className="ml-auto h-4 w-4" />
      )}
    </div>
  );
};

const DashboardContent = ({ section }) => {
  switch (section) {
    case "Dashboard":
      return <Home />;
    // case "Project":
    //   return <ProjectDashboard />;
    case "Blog":
      return <BlogDashboard />;
    case "Gallery":
      return <GalleryDashboard />;
    case "Inquiry Data":
      return <InquiryDashboard />;
    // case "Job Application":
    //   return <ApplicationDashboard />;
    default:
      return <Home />;
  }
};

const Dashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [section, setSection] = useState("Dashboard");
  const [user, setUser] = useState("Admin");
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { adminData } = location?.state || { adminData: null };

  useEffect(() => {
    if (adminData) {
      setUser(adminData?.user?.email || "Admin");
    } else {
      setUser("Admin");
    }
    
    // Close mobile menu on screen resize
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileMenuOpen(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [adminData]);

  const logout = () => {
    setUserMenuOpen(false);
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, Logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("admin");
        Swal.fire({
          title: "Logged Out",
          text: "You have been logged out successfully!",
          icon: "success",
          confirmButtonText: "OK",
        }).then(() => {
          navigate("/");
        });
      }
    });
  };

  const toggleUserMenu = () => {
    setUserMenuOpen(!userMenuOpen);
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };
  
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="flex h-screen bg-neutral-100">


      {/* Overlay for mobile menu */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-20 md:hidden"
          onClick={toggleMobileMenu}
        ></div>
      )}
      
      {/* Sidebar - Desktop */}
      <div className={`hidden md:block bg-neutral-900 transition-all duration-300 ease-in-out ${sidebarCollapsed ? 'w-16' : 'w-64'}`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-800 bg-white">
            {!sidebarCollapsed && (
              // <a href="https://www.codecrafter.co.in/" target="_blank" rel="noopener noreferrer">
              //   <img src={cclogo} alt="CodeCrafter Logo" className="h-12" />
              // </a>
               <div className="">
              <h1 className=" font-semibold text-neutral-800">Retd. Judge Ashok Kumar</h1>
            </div>
            )}
            <button 
              className="p-1.5 rounded-lg bg-neutral-100 text-neutral-800 hover:text-gray-700 hover:bg-neutral-200 transition-colors"
              onClick={toggleSidebar}
            >
              <Menu size={18} />
            </button>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 px-3 py-3 overflow-y-auto">
            <SidebarItem 
              name="Dashboard" 
              icon={<BarChart2 size={20} />} 
              active={section === "Dashboard"} 
              onClick={setSection} 
              collapsed={sidebarCollapsed} 
            />
            <SidebarItem 
              name="Inquiry Data" 
              icon={<MailQuestion size={20} />} 
              active={section === "Inquiry Data"} 
              onClick={setSection} 
              collapsed={sidebarCollapsed} 
            />
            <SidebarItem 
              name="Blog" 
              icon={<Rss size={20} />} 
              active={section === "Blog"} 
              onClick={setSection} 
              collapsed={sidebarCollapsed} 
            />
            {/* <SidebarItem 
              name="Project" 
              icon={<FolderOpenDot size={20} />} 
              active={section === "Project"} 
              onClick={setSection} 
              collapsed={sidebarCollapsed} 
            /> */}
            <SidebarItem 
              name="Gallery" 
              icon={<Images size={20} />} 
              active={section === "Gallery"} 
              onClick={setSection} 
              collapsed={sidebarCollapsed} 
            />
            {/* <SidebarItem 
              name="Job Application" 
              icon={<BadgeInfo size={20} />} 
              active={section === "Job Application"} 
              onClick={setSection} 
              collapsed={sidebarCollapsed} 
            /> */}
          </div>
          
          {/* Bottom section */}
          {/* {!sidebarCollapsed && (
            <div className="py-2 px-4 border-t border-neutral-800">
              <button 
                onClick={logout}
                className="flex items-center w-full px-3 py-2 text-neutral-300 rounded-lg hover:bg-neutral-700 hover:text-white transition-colors"
              >
                <LogOut size={20} className="mr-2 rotate-180" />
                <span>Logout</span>
              </button>
            </div>
          )} */}
        </div>
      </div>
      
      {/* Sidebar - Mobile */}
      <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-neutral-900 transform ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out md:hidden`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-neutral-800">
            <a href="https://www.codecrafter.co.in/" target="_blank" rel="noopener noreferrer">
              <img src={cclogo} alt="CodeCrafter Logo" className="h-8" />
            </a>
            <button 
              className="p-1.5 rounded-lg bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700"
              onClick={toggleMobileMenu}
            >
              <X size={18} />
            </button>
          </div>
          
          {/* Navigation */}
          <div className="flex-1 px-3 py-4 overflow-y-auto">
            <SidebarItem 
              name="Dashboard" 
              icon={<BarChart2 size={20} />} 
              active={section === "Dashboard"} 
              onClick={(name) => {
                setSection(name);
                setMobileMenuOpen(false);
              }} 
              collapsed={false} 
            />
            <SidebarItem 
              name="Inquiry Data" 
              icon={<MailQuestion size={20} />} 
              active={section === "Inquiry Data"} 
              onClick={(name) => {
                setSection(name);
                setMobileMenuOpen(false);
              }} 
              collapsed={false} 
            />
            <SidebarItem 
              name="Blog" 
              icon={<Rss size={20} />} 
              active={section === "Blog"} 
              onClick={(name) => {
                setSection(name);
                setMobileMenuOpen(false);
              }} 
              collapsed={false} 
            />
            <SidebarItem 
              name="Project" 
              icon={<FolderOpenDot size={20} />} 
              active={section === "Project"} 
              onClick={(name) => {
                setSection(name);
                setMobileMenuOpen(false);
              }} 
              collapsed={false} 
            />
            <SidebarItem 
              name="Gallery" 
              icon={<Images size={20} />} 
              active={section === "Gallery"} 
              onClick={(name) => {
                setSection(name);
                setMobileMenuOpen(false);
              }} 
              collapsed={false} 
            />
            {/* <SidebarItem 
              name="Job Application" 
              icon={<BadgeInfo size={20} />} 
              active={section === "Job Application"} 
              onClick={(name) => {
                setSection(name);
                setMobileMenuOpen(false);
              }} 
              collapsed={false} 
            /> */}
          </div>
          
          {/* Bottom section */}
          <div className="p-4 border-t border-neutral-800">
            <button 
              onClick={logout}
              className="flex items-center w-full px-3 py-2 text-neutral-300 rounded-lg hover:bg-neutral-700 hover:text-white transition-colors"
            >
              <LogOut size={20} className="mr-3" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative flex flex-col overflow-hidden">

        {/* Header */}
        <header className="bg-neutral-950 shadow-sm ">
          <div className="flex items-center justify-end px-4 py-3">
            <div className="flex items-center md:hidden">
              <button
                className="p-2 rounded-md text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 focus:outline-none"
                onClick={toggleMobileMenu}
              >
                <Menu size={24} />
              </button>
            </div>
            
           
            
            <div className="flex items-center space-x-4">
              
              <div className="relative">
                <button
                  className="flex items-center space-x-2 focus:outline-none"
                  onClick={toggleUserMenu}
                >
                  <img
                    src="https://www.w3schools.com/w3images/avatar3.png"
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full border border-neutral-200"
                  />
                  <div className="hidden md:block text-left">
                    <span className="block text-sm font-medium text-white">{user}</span>
                    <span className="block text-xs text-neutral-100">Admin</span>
                  </div>
                  <ChevronDown size={16} className="hidden md:block text-neutral-100" />
                </button>
                
                {userMenuOpen && (
                  <div className="absolute z-50 right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-neutral-200 ring-opacity-5 ">
                    <div className="px-4 py-2 text-sm text-neutral-500 border-b">
                      Signed in as <span className="font-medium text-neutral-900">{user}</span>
                    </div>
                   
                    <button 
                      onClick={logout}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-neutral-100 "
                    >
                      <div className="flex items-center">
                        <LogOut size={16} className="mr-2" />
                        <span>Logout</span>
                      </div>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto ">
          <div className="p-1">
            <DashboardContent section={section} />
          </div>
        </main>
        
        <div className=" border-t border-gray-200 w-full ">

      <CopyRight/>
</div>
      </div>
    </div>
  );
};

export default Dashboard;