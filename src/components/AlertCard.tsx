// ============================================
// MiniSentinel — Alert Card Component
// ============================================

import { useRef, useEffect } from 'react';
import { Alert } from '../types';
import { AlertTriangle, Shield, Zap, Activity, Clock, Check, Eye } from 'lucide-react';
import gsap from 'gsap';
import './AlertCard.css';

interface AlertCardProps {
    alert: Alert;
    onAcknowledge?: (id: string) => void;
    onResolve?: (id: string) => void;
    onViewDetails?: (alert: Alert) => void;
    compact?: boolean;
}

function getAlertIcon(type: string) {
    switch (type) {
        case 'brute_force': return <Shield size={20} />;
        case 'ddos': return <Zap size={20} />;
        case 'suspicious_access': return <AlertTriangle size={20} />;
        case 'anomaly': return <Activity size={20} />;
        default: return <AlertTriangle size={20} />;
    }
}

function formatTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
}

function getTypeLabel(type: string): string {
    return type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

export function AlertCard({
    alert,
    onAcknowledge,
    onResolve,
    onViewDetails,
    compact = false,
}: AlertCardProps) {
    const cardRef = useRef<HTMLDivElement>(null);

    // Pulse animation for critical alerts
    useEffect(() => {
        if (alert.severity === 'critical' && alert.status === 'active' && cardRef.current) {
            gsap.to(cardRef.current, {
                boxShadow: '0 0 30px rgba(255, 51, 102, 0.3)',
                duration: 1,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
            });
        }

        return () => {
            if (cardRef.current) {
                gsap.killTweensOf(cardRef.current);
            }
        };
    }, [alert.severity, alert.status]);

    return (
        <div
            className={`alert-card ${alert.severity} ${alert.status} ${compact ? 'compact' : ''}`}
            ref={cardRef}
        >
            <div className="alert-icon">
                {getAlertIcon(alert.type)}
            </div>

            <div className="alert-content">
                <div className="alert-header">
                    <span className={`alert-severity badge-${alert.severity}`}>
                        {alert.severity}
                    </span>
                    <span className="alert-type">{getTypeLabel(alert.type)}</span>
                    <span className="alert-time">
                        <Clock size={12} />
                        {formatTimeAgo(alert.createdAt)}
                    </span>
                </div>

                <p className="alert-description">{alert.description}</p>

                {alert.sourceIp && (
                    <div className="alert-meta">
                        <span className="alert-ip">Source: {alert.sourceIp}</span>
                        {alert.relatedLogs.length > 0 && (
                            <span className="alert-logs-count">
                                {alert.relatedLogs.length} related logs
                            </span>
                        )}
                    </div>
                )}
            </div>

            {!compact && (
                <div className="alert-actions">
                    {alert.status === 'active' && (
                        <button
                            className="btn btn-small"
                            onClick={() => onAcknowledge?.(alert.id)}
                        >
                            <Eye size={14} />
                            Acknowledge
                        </button>
                    )}
                    {alert.status !== 'resolved' && (
                        <button
                            className="btn btn-small btn-success"
                            onClick={() => onResolve?.(alert.id)}
                        >
                            <Check size={14} />
                            Resolve
                        </button>
                    )}
                    <button
                        className="btn btn-small"
                        onClick={() => onViewDetails?.(alert)}
                    >
                        View Details
                    </button>
                </div>
            )}

            <div className={`alert-status-indicator ${alert.status}`} />
        </div>
    );
}

export default AlertCard;
