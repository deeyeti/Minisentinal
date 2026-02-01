// ============================================
// MiniSentinel — Mock Log Generator
// ============================================

import { Log, LogLevel, LogSource } from '../types';

// Sample data pools
const LOG_SOURCES: LogSource[] = ['auth', 'firewall', 'app', 'database', 'network', 'system'];

const LOG_MESSAGES: Record<LogSource, { level: LogLevel; message: string }[]> = {
    auth: [
        { level: 'info', message: 'User login successful' },
        { level: 'info', message: 'Password changed for user account' },
        { level: 'warn', message: 'Failed login attempt - invalid password' },
        { level: 'warn', message: 'Multiple failed login attempts detected' },
        { level: 'error', message: 'Authentication service timeout' },
        { level: 'error', message: 'Invalid token - session expired' },
        { level: 'debug', message: 'Session token refreshed' },
    ],
    firewall: [
        { level: 'info', message: 'Connection allowed from trusted network' },
        { level: 'warn', message: 'Blocked connection attempt to restricted port' },
        { level: 'warn', message: 'Suspicious port scan detected' },
        { level: 'error', message: 'DDoS attack pattern detected' },
        { level: 'error', message: 'Blocked malicious payload' },
        { level: 'debug', message: 'Firewall rule updated' },
    ],
    app: [
        { level: 'info', message: 'API request processed successfully' },
        { level: 'info', message: 'Cache refreshed for endpoint' },
        { level: 'warn', message: 'Rate limit threshold reached' },
        { level: 'warn', message: 'Deprecated API endpoint accessed' },
        { level: 'error', message: 'Unhandled exception in request handler' },
        { level: 'error', message: 'Service unavailable - circuit breaker open' },
        { level: 'debug', message: 'Request processed in 42ms' },
    ],
    database: [
        { level: 'info', message: 'Query executed successfully' },
        { level: 'info', message: 'Connection pool initialized' },
        { level: 'warn', message: 'Slow query detected (>1000ms)' },
        { level: 'warn', message: 'Connection pool nearing capacity' },
        { level: 'error', message: 'Database connection failed' },
        { level: 'error', message: 'Transaction deadlock detected' },
        { level: 'debug', message: 'Query plan optimized' },
    ],
    network: [
        { level: 'info', message: 'New connection established' },
        { level: 'info', message: 'SSL certificate validated' },
        { level: 'warn', message: 'High latency detected on route' },
        { level: 'warn', message: 'Packet loss exceeds threshold' },
        { level: 'error', message: 'Connection reset by peer' },
        { level: 'error', message: 'DNS resolution failed' },
        { level: 'debug', message: 'Keepalive packet sent' },
    ],
    system: [
        { level: 'info', message: 'Service started successfully' },
        { level: 'info', message: 'Configuration reloaded' },
        { level: 'warn', message: 'Memory usage exceeds 80%' },
        { level: 'warn', message: 'Disk space running low' },
        { level: 'error', message: 'Out of memory exception' },
        { level: 'error', message: 'Service crash detected - restarting' },
        { level: 'debug', message: 'Garbage collection completed' },
    ],
};

// IP address pools (mix of internal and external)
const IP_POOLS = {
    internal: [
        '192.168.1.10', '192.168.1.25', '192.168.1.50', '192.168.1.100',
        '10.0.0.5', '10.0.0.12', '10.0.0.88', '10.0.1.15',
    ],
    external: [
        '203.45.67.89', '185.220.101.42', '45.33.32.156', '104.18.21.226',
        '172.217.14.110', '151.101.1.140', '93.184.216.34', '52.94.236.248',
    ],
    suspicious: [
        '185.143.223.12', '45.155.205.33', '89.248.167.131', '162.247.74.7',
        '23.129.64.100', '77.247.181.162', '185.220.100.252', '171.25.193.77',
    ],
};

// Helper functions
function randomItem<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function generateId(): string {
    return `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getRandomIP(bias: 'normal' | 'suspicious' = 'normal'): string {
    const pools = bias === 'suspicious'
        ? [...IP_POOLS.suspicious, ...IP_POOLS.external]
        : [...IP_POOLS.internal, ...IP_POOLS.external, ...IP_POOLS.suspicious];

    return randomItem(pools);
}

// Generate a single log entry
export function generateLog(overrides?: Partial<Log>): Log {
    const source = overrides?.source || randomItem(LOG_SOURCES);
    const messageData = randomItem(LOG_MESSAGES[source]);

    return {
        id: generateId(),
        timestamp: new Date(),
        source,
        level: overrides?.level || messageData.level,
        ip: overrides?.ip || getRandomIP(),
        message: overrides?.message || messageData.message,
        ...overrides,
    };
}

// Generate multiple logs
export function generateLogs(count: number): Log[] {
    return Array.from({ length: count }, () => generateLog());
}

// Generate logs over a time range (for historical data)
export function generateHistoricalLogs(count: number, hoursBack: number = 24): Log[] {
    const now = Date.now();
    const startTime = now - (hoursBack * 60 * 60 * 1000);

    return Array.from({ length: count }, () => {
        const log = generateLog();
        log.timestamp = new Date(startTime + Math.random() * (now - startTime));
        return log;
    }).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

// Generate attack pattern logs (for demo)
export function generateBruteForcePattern(ip: string, count: number = 10): Log[] {
    const now = Date.now();
    return Array.from({ length: count }, (_, i) => ({
        id: generateId(),
        timestamp: new Date(now - (count - i) * 2000), // 2 seconds apart
        source: 'auth' as LogSource,
        level: 'warn' as LogLevel,
        ip,
        message: 'Failed login attempt - invalid password',
    }));
}

export function generateDDoSPattern(ip: string, count: number = 150): Log[] {
    const now = Date.now();
    return Array.from({ length: count }, (_, i) => ({
        id: generateId(),
        timestamp: new Date(now - (count - i) * 50), // 50ms apart
        source: 'firewall' as LogSource,
        level: 'warn' as LogLevel,
        ip,
        message: 'High frequency request detected',
    }));
}

export { IP_POOLS };
