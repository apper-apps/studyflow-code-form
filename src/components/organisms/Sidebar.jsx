import React, { useContext } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { cn } from "@/utils/cn";
import ApperIcon from "@/components/ApperIcon";
import { AuthContext } from "@/App";

const navigation = [
  { name: "Dashboard", href: "/", icon: "Home" },
  { name: "Courses", href: "/courses", icon: "BookOpen" },
  { name: "Assignments", href: "/assignments", icon: "FileText" },
  { name: "Calendar", href: "/calendar", icon: "Calendar" },
  { name: "Grades", href: "/grades", icon: "Award" },
]

const Sidebar = ({ className }) => {
  const location = useLocation()

  return (
    <aside className={cn("bg-white border-r border-gray-100", className)}>
      <div className="flex flex-col h-full">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="GraduationCap" className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                StudyFlow
              </h1>
              <p className="text-sm text-gray-500">Academic Manager</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href
            
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200",
                  isActive
                    ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 border border-primary-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                )}
              >
                <ApperIcon 
                  name={item.icon} 
                  className={cn(
                    "h-5 w-5 transition-colors",
                    isActive ? "text-primary-600" : "text-gray-400"
                  )} 
                />
                <span>{item.name}</span>
              </NavLink>
            )
          })}
        </nav>

<div className="p-4 border-t border-gray-100">
          <div className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                <ApperIcon name="User" className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">Student</p>
                <p className="text-xs text-gray-500">Fall 2024</p>
              </div>
<button
                onClick={() => {
                  const { logout } = useContext(AuthContext);
                  logout();
                }}
                className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
                title="Logout"
              >
                <ApperIcon name="LogOut" className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar