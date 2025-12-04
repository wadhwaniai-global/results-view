import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { cn } from '../../utils/cn';

type SidebarItem = {
  path: string;
  label: string;
  icon: React.ReactNode;
};

const sidebarItems: SidebarItem[] = [
  {
    path: '/admin/panel',
    label: 'Dashboard',
    icon: <i className="fas fa-chart-line"></i>,
  },
  {
    path: '/admin/panel/campaigns',
    label: 'Create / Manage Campaign',
    icon: <i className="fas fa-bullhorn"></i>,
  },
  {
    path: '/admin/panel/test-admins',
    label: 'Add / Remove Test Admins',
    icon: <i className="fas fa-users"></i>,
  },
  {
    path: '/admin/panel/facilities',
    label: 'Add / Remove Facility',
    icon: <i className="fas fa-building"></i>,
  },
];

type AdminSidebarProps = {
  className?: string;
};

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ className }) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      className={cn(
        'bg-white border-end h-100 p-2 sm:p-3 d-none d-md-block',
        className
      )}
      style={{ minHeight: '100vh', width: '250px' }}
    >
      <div className="mb-3 sm:mb-4">
        <h5 className="text-dark fw-bold mb-0 text-sm sm:text-base">Admin Panel</h5>
      </div>
      <nav>
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-100 text-start btn mb-2 d-flex align-items-center gap-2 text-sm sm:text-base py-2',
                isActive
                  ? 'btn-primary text-white'
                  : 'btn-outline-secondary text-dark'
              )}
            >
              <span className="flex-shrink-0">{item.icon}</span>
              <span className="text-start">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};

export default AdminSidebar;

