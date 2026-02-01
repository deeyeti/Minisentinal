// ============================================
// MiniSentinel — Detection Rules
// ============================================

import { Rule } from '../types';

export const DETECTION_RULES: Rule[] = [
    {
        id: 'rule_001',
        name: 'Brute Force Detection',
        description: 'Detects multiple failed login attempts from the same IP address within a short time window. Triggers when more than 5 failed logins occur from a single IP in 60 seconds.',
        condition: {
            type: 'threshold',
            field: 'failed_login_count',
            operator: 'gt',
            value: 5,
            timeWindowSeconds: 60,
        },
        severity: 'critical',
        enabled: true,
        hitCount: 23,
    },
    {
        id: 'rule_002',
        name: 'DDoS Detection',
        description: 'Identifies potential Distributed Denial of Service attacks by monitoring request frequency. Triggers when more than 100 requests are received from a single IP in 10 seconds.',
        condition: {
            type: 'frequency',
            field: 'request_count',
            operator: 'gt',
            value: 100,
            timeWindowSeconds: 10,
        },
        severity: 'critical',
        enabled: true,
        hitCount: 8,
    },
    {
        id: 'rule_003',
        name: 'Suspicious Endpoint Access',
        description: 'Monitors access to sensitive endpoints that should not be publicly accessible. Triggers when requests are made to forbidden paths like /admin, /config, /debug, or /internal.',
        condition: {
            type: 'pattern',
            field: 'request_path',
            operator: 'matches',
            value: '^/(admin|config|debug|internal)',
        },
        severity: 'high',
        enabled: true,
        hitCount: 45,
    },
    {
        id: 'rule_004',
        name: 'SQL Injection Attempt',
        description: 'Detects potential SQL injection attacks by scanning request parameters for common SQL injection patterns and keywords.',
        condition: {
            type: 'pattern',
            field: 'request_params',
            operator: 'matches',
            value: '(SELECT|INSERT|UPDATE|DELETE|DROP|UNION|--|;)',
        },
        severity: 'critical',
        enabled: true,
        hitCount: 12,
    },
    {
        id: 'rule_005',
        name: 'Unusual Geographic Access',
        description: 'Flags login attempts from geographic locations that differ significantly from the user\'s normal access patterns.',
        condition: {
            type: 'pattern',
            field: 'geo_location',
            operator: 'contains',
            value: 'anomaly_detected',
        },
        severity: 'medium',
        enabled: true,
        hitCount: 7,
    },
    {
        id: 'rule_006',
        name: 'After-Hours Access',
        description: 'Monitors for access attempts that occur outside of normal business hours (9 AM - 6 PM local time) for sensitive systems.',
        condition: {
            type: 'pattern',
            field: 'access_time',
            operator: 'matches',
            value: 'outside_business_hours',
        },
        severity: 'low',
        enabled: false,
        hitCount: 156,
    },
    {
        id: 'rule_007',
        name: 'Privilege Escalation',
        description: 'Detects attempts to elevate user privileges or access resources beyond authorization level.',
        condition: {
            type: 'pattern',
            field: 'permission_request',
            operator: 'matches',
            value: 'escalation_attempt',
        },
        severity: 'critical',
        enabled: true,
        hitCount: 3,
    },
    {
        id: 'rule_008',
        name: 'Data Exfiltration',
        description: 'Monitors for unusually large data transfers that could indicate data theft or exfiltration attempts.',
        condition: {
            type: 'threshold',
            field: 'data_transfer_mb',
            operator: 'gt',
            value: 500,
            timeWindowSeconds: 3600,
        },
        severity: 'high',
        enabled: true,
        hitCount: 2,
    },
];

export function getRuleById(id: string): Rule | undefined {
    return DETECTION_RULES.find(rule => rule.id === id);
}

export function getActiveRules(): Rule[] {
    return DETECTION_RULES.filter(rule => rule.enabled);
}

export function getRuleStats() {
    return {
        total: DETECTION_RULES.length,
        active: DETECTION_RULES.filter(r => r.enabled).length,
        disabled: DETECTION_RULES.filter(r => !r.enabled).length,
        totalHits: DETECTION_RULES.reduce((sum, r) => sum + r.hitCount, 0),
        bySeverity: {
            critical: DETECTION_RULES.filter(r => r.severity === 'critical').length,
            high: DETECTION_RULES.filter(r => r.severity === 'high').length,
            medium: DETECTION_RULES.filter(r => r.severity === 'medium').length,
            low: DETECTION_RULES.filter(r => r.severity === 'low').length,
        },
    };
}
