// ============================================
// MiniSentinel — Dashboard Page
// ============================================

import { useEffect, useRef } from 'react';
import { Activity, AlertTriangle, Shield, Clock, Zap, Server, Wifi, Database } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLogSimulator } from '../hooks/useLogSimulator';
import { StatCard } from '../components/StatCard';
import { LogTimeline } from '../components/LogTimeline';
import { AlertCard } from '../components/AlertCard';
import { TopIPsChart } from '../components/TopIPsChart';
import './Dashboard.css';

gsap.registerPlugin(ScrollTrigger);

export function Dashboard() {
    const { logs, alerts, topIPs, stats, acknowledgeAlert, resolveAlert } = useLogSimulator({
        logsPerSecond: 3,
    });

    const headerRef = useRef<HTMLDivElement>(null);
    const statsRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Entrance animations
    useEffect(() => {
        const ctx = gsap.context(() => {
            // Header animation
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: -30 },
                { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
            );

            // Stats cards stagger
            if (statsRef.current) {
                gsap.fromTo(
                    statsRef.current.children,
                    { opacity: 0, y: 40, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.6,
                        stagger: 0.1,
                        ease: 'power3.out',
                        delay: 0.2
                    }
                );
            }

            // Content sections
            if (contentRef.current) {
                gsap.fromTo(
                    contentRef.current.children,
                    { opacity: 0, y: 30 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.6,
                        stagger: 0.15,
                        ease: 'power2.out',
                        delay: 0.5
                    }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    const activeAlerts = alerts.filter(a => a.status === 'active').slice(0, 3);

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard-header" ref={headerRef}>
                <div className="header-content">
                    <h1>Security Dashboard</h1>
                    <p className="header-subtitle">Real-time threat monitoring and log analysis</p>
                </div>
                <div className="header-status">
                    <span className="status-live">
                        <span className="live-dot" />
                        Live Monitoring
                    </span>
                    <span className="status-time">{new Date().toLocaleTimeString()}</span>
                </div>
            </header>

            {/* Stats Grid */}
            <section className="stats-grid" ref={statsRef}>
                <StatCard
                    icon={<Database size={24} />}
                    label="Total Logs (24h)"
                    value={stats.totalLogs}
                    trend={{ value: 12, direction: 'up' }}
                />
                <StatCard
                    icon={<Zap size={24} />}
                    label="Logs/Minute"
                    value={stats.logsPerMinute}
                    variant="success"
                />
                <StatCard
                    icon={<AlertTriangle size={24} />}
                    label="Active Alerts"
                    value={stats.activeAlerts}
                    variant={stats.activeAlerts > 0 ? 'danger' : 'success'}
                />
                <StatCard
                    icon={<Shield size={24} />}
                    label="Critical Threats"
                    value={stats.criticalAlerts}
                    variant={stats.criticalAlerts > 0 ? 'danger' : 'success'}
                />
            </section>

            {/* Main Content */}
            <div className="dashboard-content" ref={contentRef}>
                {/* Left Column */}
                <div className="content-main">
                    {/* Log Timeline */}
                    <section className="section">
                        <LogTimeline logs={logs} maxItems={30} />
                    </section>
                </div>

                {/* Right Column */}
                <aside className="content-sidebar">
                    {/* Active Alerts */}
                    <section className="section">
                        <div className="section-header">
                            <h3>Active Alerts</h3>
                            <span className="badge badge-critical">{stats.activeAlerts}</span>
                        </div>
                        <div className="alerts-list">
                            {activeAlerts.map(alert => (
                                <AlertCard
                                    key={alert.id}
                                    alert={alert}
                                    compact
                                    onAcknowledge={acknowledgeAlert}
                                    onResolve={resolveAlert}
                                />
                            ))}
                            {activeAlerts.length === 0 && (
                                <div className="empty-state">
                                    <Shield size={32} />
                                    <p>No active alerts</p>
                                </div>
                            )}
                        </div>
                    </section>

                    {/* Top IPs */}
                    <section className="section">
                        <TopIPsChart data={topIPs} />
                    </section>

                    {/* System Status */}
                    <section className="section">
                        <div className="system-status">
                            <h3>System Status</h3>
                            <div className="status-list">
                                <div className="status-row">
                                    <Server size={16} />
                                    <span>Ingestion API</span>
                                    <span className="status-badge online">Online</span>
                                </div>
                                <div className="status-row">
                                    <Database size={16} />
                                    <span>Log Storage</span>
                                    <span className="status-badge online">Online</span>
                                </div>
                                <div className="status-row">
                                    <Activity size={16} />
                                    <span>Rule Engine</span>
                                    <span className="status-badge online">Active</span>
                                </div>
                                <div className="status-row">
                                    <Wifi size={16} />
                                    <span>Alert System</span>
                                    <span className="status-badge online">Connected</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </aside>
            </div>
        </div>
    );
}

export default Dashboard;
