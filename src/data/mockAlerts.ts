// ============================================
// MiniSentinel — Mock Alerts Generator
// ============================================

import { Alert, AlertType, AlertSeverity, AlertStatus } from '../types';
import { generateBruteForcePattern, generateDDoSPattern, IP_POOLS } from './mockLogs';

function generateId(): string {
    return `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Sample alerts
export const SAMPLE_ALERTS: Alert[] = [
    {
        id: generateId(),
        type: 'brute_force',
        severity: 'critical',
        createdAt: new Date(Date.now() - 5 * 60 * 1000),
        status: 'active',
        relatedLogs: generateBruteForcePattern('185.143.223.12', 8),
        description: 'Brute force attack detected: 8 failed login attempts in 60 seconds',
        sourceIp: '185.143.223.12',
    },
    {
        id: generateId(),
        type: 'ddos',
        severity: 'critical',
        createdAt: new Date(Date.now() - 15 * 60 * 1000),
        status: 'acknowledged',
        relatedLogs: generateDDoSPattern('45.155.205.33', 120),
        description: 'DDoS attack detected: 120 requests in 10 seconds from single IP',
        sourceIp: '45.155.205.33',
    },
    {
        id: generateId(),
        type: 'suspicious_access',
        severity: 'high',
        createdAt: new Date(Date.now() - 30 * 60 * 1000),
        status: 'active',
        relatedLogs: [],
        description: 'Access attempt to /admin/config from unauthorized IP',
        sourceIp: '89.248.167.131',
    },
    {
        id: generateId(),
        type: 'anomaly',
        severity: 'medium',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        status: 'resolved',
        relatedLogs: [],
        description: 'Unusual traffic pattern detected on port 8080',
        sourceIp: '162.247.74.7',
    },
    {
        id: generateId(),
        type: 'brute_force',
        severity: 'high',
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        status: 'resolved',
        relatedLogs: generateBruteForcePattern('23.129.64.100', 6),
        description: 'Brute force attempt blocked: 6 failed attempts, IP added to blocklist',
        sourceIp: '23.129.64.100',
    },
    {
        id: generateId(),
        type: 'suspicious_access',
        severity: 'low',
        createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
        status: 'resolved',
        relatedLogs: [],
        description: 'Attempted access to deprecated API endpoint',
        sourceIp: '77.247.181.162',
    },
];

// Generate a random alert
export function generateAlert(overrides?: Partial<Alert>): Alert {
    const types: AlertType[] = ['brute_force', 'ddos', 'suspicious_access', 'anomaly'];
    const severities: AlertSeverity[] = ['critical', 'high', 'medium', 'low'];
    const statuses: AlertStatus[] = ['active', 'acknowledged', 'resolved'];

    const type = overrides?.type || randomItem(types);
    const ip = overrides?.sourceIp || randomItem(IP_POOLS.suspicious);

    const descriptions: Record<AlertType, string[]> = {
        brute_force: [
            `Multiple failed login attempts from ${ip}`,
            `Brute force attack detected from ${ip}`,
            `Password guessing attack in progress from ${ip}`,
        ],
        ddos: [
            `High request rate detected from ${ip}`,
            `DDoS attack pattern identified from ${ip}`,
            `Request flooding detected from ${ip}`,
        ],
        suspicious_access: [
            `Unauthorized access attempt to admin panel from ${ip}`,
            `Blocked access to restricted endpoint from ${ip}`,
            `Attempted SQL injection from ${ip}`,
        ],
        anomaly: [
            `Unusual traffic pattern detected`,
            `Abnormal data transfer volume detected`,
            `Suspicious behavior pattern identified`,
        ],
    };

    return {
        id: generateId(),
        type,
        severity: overrides?.severity || randomItem(severities),
        createdAt: overrides?.createdAt || new Date(),
        status: overrides?.status || 'active',
        relatedLogs: [],
        description: overrides?.description || randomItem(descriptions[type]),
        sourceIp: ip,
        ...overrides,
    };
}

// Get stats from alerts
export function getAlertStats(alerts: Alert[]) {
    return {
        total: alerts.length,
        active: alerts.filter(a => a.status === 'active').length,
        acknowledged: alerts.filter(a => a.status === 'acknowledged').length,
        resolved: alerts.filter(a => a.status === 'resolved').length,
        critical: alerts.filter(a => a.severity === 'critical').length,
        high: alerts.filter(a => a.severity === 'high').length,
        medium: alerts.filter(a => a.severity === 'medium').length,
        low: alerts.filter(a => a.severity === 'low').length,
    };
}

export { SAMPLE_ALERTS as mockAlerts };
