import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { LayoutDashboard, Settings, Activity } from 'lucide-react';
import '../styles/layout.css'; // We'll create this next

const MainLayout = () => {
    return (
        <div className="layout-container">
            <aside className="sidebar glass-panel">
                <div className="sidebar-header">
                    <Activity className="logo-icon" size={32} color="var(--accent-color)" />
                    <h1 className="logo-text">P.E.IoT</h1>
                </div>

                <nav className="sidebar-nav">
                    <NavLink
                        to="/"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>

                    <NavLink
                        to="/admin"
                        className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                    >
                        <Settings size={20} />
                        <span>Admin</span>
                    </NavLink>
                </nav>

                <div className="sidebar-footer">
                    <div className="user-info">
                        <div className="avatar">A</div>
                        <div className="details">
                            <span className="name">Admin User</span>
                            <span className="role">Administrator</span>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="main-content">
                <header className="top-bar">
                    <h2 className="page-title">Welcome back</h2>
                    <div className="date-display">{new Date().toLocaleDateString()}</div>
                </header>
                <div className="content-scroll">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;
