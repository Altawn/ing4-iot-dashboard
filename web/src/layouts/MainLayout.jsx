import React, { useState } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    Settings,
    Menu,
    ChevronLeft,
    Activity,
    LogOut
} from 'lucide-react';
import '../styles/layout.css';

const MainLayout = () => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    return (
        <div className="layout-outer-container">
            <div className={`layout-container ${isCollapsed ? 'collapsed' : ''}`}>
                <aside className="sidebar">
                    <div className="sidebar-brand">
                        <div className="brand-left">
                            <Activity className="brand-icon" size={24} />
                            {!isCollapsed && <span className="brand-name">PE I.O.T</span>}
                        </div>
                        <button
                            className="sidebar-toggle-alt"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                        >
                            {isCollapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                        </button>
                    </div>

                    <div className="sidebar-profile">
                        <div className="profile-image-container">
                            <img
                                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Mark"
                                alt="Profile"
                                className="profile-image"
                            />
                        </div>
                        <div className="profile-welcome">Welcome Back,</div>
                        <div className="profile-name">Daniel Ikka</div>
                    </div>

                    <nav className="sidebar-nav">
                        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <LayoutDashboard size={20} />
                            {!isCollapsed && <span>Dashboard</span>}
                        </NavLink>

                        <NavLink to="/admin" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                            <Settings size={20} />
                            {!isCollapsed && <span>Admin</span>}
                        </NavLink>
                    </nav>

                    <div className="sidebar-footer">
                        <NavLink to="/logout" className="nav-item">
                            <LogOut size={20} />
                            {!isCollapsed && <span>Log Out</span>}
                        </NavLink>
                    </div>
                </aside>

                <main className="main-content">
                    <div className="content-scroll">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;
