// ============================================
// MiniSentinel — Alerts Panel Page
// ============================================

import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { AlertTriangle, Filter, CheckCircle, Eye, Clock } from 'lucide-react';
import { Alert, AlertStatus } from '../types';
import { useLogSimulator } from '../hooks/useLogSimulator';
import { AlertCard } from '../components/AlertCard';
import './AlertsPanel.css';

type FilterStatus = AlertStatus | 'all';

export function AlertsPanel() {
    const { alerts, acknowledgeAlert, resolveAlert } = useLogSimulator({ logsPerSecond: 1 });
    const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
    const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

    const headerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Entrance animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );

            gsap.fromTo(
                contentRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 }
            );
        });

        return () => ctx.revert();
    }, []);

    // Filter alerts
    const filteredAlerts = statusFilter === 'all'
        ? alerts
        : alerts.filter(a => a.status === statusFilter);

    // Stats
    const stats = {
        active: alerts.filter(a => a.status === 'active').length,
        acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
        resolved: alerts.filter(a => a.status === 'resolved').length,
    };

    const filterOptions: { value: FilterStatus; label: string; icon: React.ReactNode; count: number }[] = [
        { value: 'all', label: 'All Alerts', icon: <Filter size={16} />, count: alerts.length },
        { value: 'active', label: 'Active', icon: <AlertTriangle size={16} />, count: stats.active },
        { value: 'acknowledged', label: 'Acknowledged', icon: <Eye size={16} />, count: stats.acknowledged },
        { value: 'resolved', label: 'Resolved', icon: <CheckCircle size={16} />, count: stats.resolved },
    ];

    return (
        <div className="alerts-panel">
            {/* Header */}
            <header className="page-header" ref={headerRef}>
                <div className="header-content">
                    <h1>
                        <AlertTriangle size={32} />
                        Alerts Panel
                    </h1>
                    <p className="header-subtitle">
                        Monitor and manage security alerts from detection rules
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="alert-stats">
                    <div className="stat-bubble critical">
                        <span className="stat-number">{stats.active}</span>
                        <span className="stat-label">Active</span>
                    </div>
                    <div className="stat-bubble warning">
                        <span className="stat-number">{stats.acknowledged}</span>
                        <span className="stat-label">Pending</span>
                    </div>
                    <div className="stat-bubble success">
                        <span className="stat-number">{stats.resolved}</span>
                        <span className="stat-label">Resolved</span>
                    </div>
                </div>
            </header>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                {filterOptions.map(option => (
                    <button
                        key={option.value}
                        className={`filter-tab ${statusFilter === option.value ? 'active' : ''}`}
                        onClick={() => setStatusFilter(option.value)}
                    >
                        {option.icon}
                        <span>{option.label}</span>
                        <span className="tab-count">{option.count}</span>
                    </button>
                ))}
            </div>

            {/* Alerts List */}
            <div className="alerts-content" ref={contentRef}>
                {filteredAlerts.length > 0 ? (
                    <div className="alerts-grid">
                        {filteredAlerts.map(alert => (
                            <AlertCard
                                key={alert.id}
                                alert={alert}
                                onAcknowledge={acknowledgeAlert}
                                onResolve={resolveAlert}
                                onViewDetails={setSelectedAlert}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <CheckCircle size={48} />
                        <h3>No {statusFilter !== 'all' ? statusFilter : ''} alerts</h3>
                        <p>All clear! No alerts match the current filter.</p>
                    </div>
                )}
            </div>

            {/* Alert Detail Modal */}
            {selectedAlert && (
                <div className="alert-detail-overlay" onClick={() => setSelectedAlert(null)}>
                    <div className="alert-detail-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Alert Details</h3>
                            <button className="modal-close" onClick={() => setSelectedAlert(null)}>×</button>
                        </div>
                        <div className="modal-content">
                            <div className="alert-detail-header">
                                <span className={`severity-badge severity-${selectedAlert.severity}`}>
                                    {selectedAlert.severity}
                                </span>
                                <span className={`status-badge status-${selectedAlert.status}`}>
                                    {selectedAlert.status}
                                </span>
                            </div>

                            <h2 className="alert-type-title">
                                {selectedAlert.type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </h2>

                            <p className="alert-description">{selectedAlert.description}</p>

                            <div className="detail-grid">
                                <div className="detail-item">
                                    <Clock size={14} />
                                    <span className="detail-label">Created</span>
                                    <span className="detail-value">
                                        {selectedAlert.createdAt.toLocaleString()}
                                    </span>
                                </div>
                                {selectedAlert.sourceIp && (
                                    <div className="detail-item">
                                        <span className="detail-label">Source IP</span>
                                        <span className="detail-value mono">{selectedAlert.sourceIp}</span>
                                    </div>
                                )}
                                <div className="detail-item">
                                    <span className="detail-label">Related Logs</span>
                                    <span className="detail-value">{selectedAlert.relatedLogs.length} entries</span>
                                </div>
                            </div>

                            {selectedAlert.relatedLogs.length > 0 && (
                                <div className="related-logs">
                                    <h4>Related Log Entries</h4>
                                    <div className="logs-preview">
                                        {selectedAlert.relatedLogs.slice(0, 5).map(log => (
                                            <div key={log.id} className="log-preview-item">
                                                <span className="log-time">
                                                    {log.timestamp.toLocaleTimeString()}
                                                </span>
                                                <span className={`log-level level-${log.level}`}>
                                                    {log.level}
                                                </span>
                                                <span className="log-message">{log.message}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="modal-actions">
                                {selectedAlert.status === 'active' && (
                                    <button
                                        className="btn"
                                        onClick={() => {
                                            acknowledgeAlert(selectedAlert.id);
                                            setSelectedAlert({ ...selectedAlert, status: 'acknowledged' });
                                        }}
                                    >
                                        <Eye size={16} />
                                        Acknowledge
                                    </button>
                                )}
                                {selectedAlert.status !== 'resolved' && (
                                    <button
                                        className="btn btn-success"
                                        onClick={() => {
                                            resolveAlert(selectedAlert.id);
                                            setSelectedAlert(null);
                                        }}
                                    >
                                        <CheckCircle size={16} />
                                        Mark as Resolved
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AlertsPanel;
