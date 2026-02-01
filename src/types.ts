// ============================================
// MiniSentinel — Type Definitions
// ============================================

// Log Types
export interface Log {
    id: string;
    timestamp: Date;
    source: LogSource;
    level: LogLevel;
    ip: string;
    message: string;
}

export type LogLevel = 'error' | 'warn' | 'info' | 'debug';
export type LogSource = 'auth' | 'firewall' | 'app' | 'database' | 'network' | 'system';

// Alert Types
export interface Alert {
    id: string;
    type: AlertType;
    severity: AlertSeverity;
    createdAt: Date;
    status: AlertStatus;
    relatedLogs: Log[];
    description: string;
    sourceIp?: string;
}

export type AlertType = 'brute_force' | 'ddos' | 'suspicious_access' | 'anomaly';
export type AlertSeverity = 'critical' | 'high' | 'medium' | 'low';
export type AlertStatus = 'active' | 'acknowledged' | 'resolved';

// Rule Types
export interface Rule {
    id: string;
    name: string;
    description: string;
    condition: RuleCondition;
    severity: AlertSeverity;
    enabled: boolean;
    hitCount: number;
}

export interface RuleCondition {
    type: 'threshold' | 'pattern' | 'frequency';
    field: string;
    operator: 'gt' | 'lt' | 'eq' | 'contains' | 'matches';
    value: string | number;
    timeWindowSeconds?: number;
}

// Dashboard Stats
export interface DashboardStats {
    totalLogs: number;
    logsPerMinute: number;
    activeAlerts: number;
    criticalAlerts: number;
    topThreats: number;
    blockedIPs: number;
    uptime: number;
}

// Chart Data
export interface TopIP {
    ip: string;
    requestCount: number;
    threatScore: number;
    lastSeen: Date;
}

// Filter Types
export interface LogFilters {
    search: string;
    level: LogLevel | 'all';
    source: LogSource | 'all';
    startTime?: Date;
    endTime?: Date;
    ip?: string;
}

// Navigation
export interface NavItem {
    id: string;
    label: string;
    path: string;
    icon: string;
}
