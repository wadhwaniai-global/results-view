import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { Button } from '../../ui';

type MobileSidebarProps = {
  className?: string;
};

export const MobileSidebar: React.FC<MobileSidebarProps> = ({ className }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <div className="d-md-none position-fixed top-0 start-0 p-2 z-3" style={{ zIndex: 1050 }}>
        <Button
          variant="glass"
          onClick={() => setIsOpen(!isOpen)}
          className="shadow"
          icon={<i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>}
        >
          {isOpen ? 'Close' : 'Menu'}
        </Button>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="d-md-none position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50"
          style={{ zIndex: 1040 }}
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={className}
        style={{
          position: isOpen ? 'fixed' : 'relative',
          left: isOpen ? '0' : undefined,
          top: '0',
          zIndex: 1050,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.3s ease-in-out',
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        <AdminSidebar />
      </div>
    </>
  );
};

export default MobileSidebar;

