// ============================================
// MiniSentinel — Sidebar Navigation
// ============================================

import { useState, useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import {
    LayoutDashboard,
    FileText,
    AlertTriangle,
    Shield,
    ChevronLeft,
    ChevronRight,
    Activity
} from 'lucide-react';
import gsap from 'gsap';
import './Sidebar.css';

interface NavItem {
    path: string;
    label: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { path: '/', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { path: '/logs', label: 'Logs Explorer', icon: <FileText size={20} /> },
    { path: '/alerts', label: 'Alerts', icon: <AlertTriangle size={20} /> },
    { path: '/rules', label: 'Rules', icon: <Shield size={20} /> },
];

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const logoRef = useRef<HTMLDivElement>(null);
    const navRef = useRef<HTMLDivElement>(null);

    // Animate logo on mount
    useEffect(() => {
        if (logoRef.current) {
            gsap.fromTo(
                logoRef.current,
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' }
            );
        }

        if (navRef.current) {
            gsap.fromTo(
                navRef.current.children,
                { opacity: 0, x: -20 },
                { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: 'power2.out', delay: 0.3 }
            );
        }
    }, []);

    // Pulse animation for active alerts indicator
    useEffect(() => {
        const alertIndicator = document.querySelector('.alert-indicator');
        if (alertIndicator) {
            gsap.to(alertIndicator, {
                scale: 1.2,
                opacity: 0.5,
                duration: 0.8,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        }
    }, []);

    return (
        <aside className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
            {/* Logo Section */}
            <div className="sidebar-header" ref={logoRef}>
                <div className="logo">
                    <div className="logo-icon">
                        <Activity size={collapsed ? 24 : 32} />
                    </div>
                    {!collapsed && (
                        <div className="logo-text">
                            <span className="logo-title">MiniSentinel</span>
                            <span className="logo-subtitle">SIEM Dashboard</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="sidebar-nav" ref={navRef}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `nav-item ${isActive ? 'active' : ''}`
                        }
                        title={collapsed ? item.label : undefined}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        {!collapsed && <span className="nav-label">{item.label}</span>}
                        {item.path === '/alerts' && (
                            <span className="alert-indicator" />
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Status Section */}
            {!collapsed && (
                <div className="sidebar-status">
                    <div className="status-item">
                        <span className="status-dot online" />
                        <span className="status-text">System Online</span>
                    </div>
                    <div className="status-item">
                        <span className="status-label">Last Scan:</span>
                        <span className="status-value">2s ago</span>
                    </div>
                </div>
            )}

            {/* Collapse Toggle */}
            <button
                className="collapse-btn"
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
                {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
        </aside>
    );
}

export default Sidebar;
