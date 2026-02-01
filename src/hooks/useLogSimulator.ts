// ============================================
// MiniSentinel — Log Simulator Hook
// ============================================

import { useState, useEffect, useCallback, useRef } from 'react';
import { Log, Alert, TopIP } from '../types';
import { generateLog, generateHistoricalLogs, IP_POOLS } from '../data/mockLogs';
import { SAMPLE_ALERTS, generateAlert } from '../data/mockAlerts';

interface UseLogSimulatorOptions {
    initialLogCount?: number;
    logsPerSecond?: number;
    enabled?: boolean;
}

export function useLogSimulator(options: UseLogSimulatorOptions = {}) {
    const {
        initialLogCount = 100,
        logsPerSecond = 2,
        enabled = true,
    } = options;

    const [logs, setLogs] = useState<Log[]>(() =>
        generateHistoricalLogs(initialLogCount, 24)
    );
    const [alerts, setAlerts] = useState<Alert[]>(SAMPLE_ALERTS);
    const [topIPs, setTopIPs] = useState<TopIP[]>([]);

    const intervalRef = useRef<number | null>(null);
    const alertIntervalRef = useRef<number | null>(null);

    // Calculate top IPs from logs
    const calculateTopIPs = useCallback((logs: Log[]): TopIP[] => {
        const ipCounts: Record<string, { count: number; lastSeen: Date }> = {};

        logs.forEach(log => {
            if (!ipCounts[log.ip]) {
                ipCounts[log.ip] = { count: 0, lastSeen: log.timestamp };
            }
            ipCounts[log.ip].count++;
            if (log.timestamp > ipCounts[log.ip].lastSeen) {
                ipCounts[log.ip].lastSeen = log.timestamp;
            }
        });

        return Object.entries(ipCounts)
            .map(([ip, data]) => ({
                ip,
                requestCount: data.count,
                threatScore: IP_POOLS.suspicious.includes(ip) ?
                    Math.floor(Math.random() * 40) + 60 :
                    Math.floor(Math.random() * 30) + 10,
                lastSeen: data.lastSeen,
            }))
            .sort((a, b) => b.requestCount - a.requestCount)
            .slice(0, 10);
    }, []);

    // Add new log
    const addLog = useCallback((log?: Partial<Log>) => {
        const newLog = generateLog(log);
        setLogs(prev => [newLog, ...prev.slice(0, 999)]); // Keep max 1000 logs
        return newLog;
    }, []);

    // Add new alert
    const addAlert = useCallback((alert?: Partial<Alert>) => {
        const newAlert = generateAlert(alert);
        setAlerts(prev => [newAlert, ...prev]);
        return newAlert;
    }, []);

    // Acknowledge alert
    const acknowledgeAlert = useCallback((alertId: string) => {
        setAlerts(prev => prev.map(alert =>
            alert.id === alertId
                ? { ...alert, status: 'acknowledged' as const }
                : alert
        ));
    }, []);

    // Resolve alert
    const resolveAlert = useCallback((alertId: string) => {
        setAlerts(prev => prev.map(alert =>
            alert.id === alertId
                ? { ...alert, status: 'resolved' as const }
                : alert
        ));
    }, []);

    // Start/stop log generation (one log every 10-20 seconds)
    useEffect(() => {
        if (!enabled) {
            if (intervalRef.current) {
                clearTimeout(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        // Schedule next log with random delay between 10-20 seconds
        const scheduleNextLog = () => {
            const delay = Math.random() * 10000 + 10000; // 10-20 seconds
            intervalRef.current = window.setTimeout(() => {
                addLog();
                scheduleNextLog();
            }, delay);
        };

        // Start with first log after 3-5 seconds
        intervalRef.current = window.setTimeout(() => {
            addLog();
            scheduleNextLog();
        }, Math.random() * 2000 + 3000);

        return () => {
            if (intervalRef.current) {
                clearTimeout(intervalRef.current);
            }
        };
    }, [enabled, addLog]);

    // Generate alerts every 15-30 seconds
    useEffect(() => {
        if (!enabled) {
            if (alertIntervalRef.current) {
                clearInterval(alertIntervalRef.current);
                alertIntervalRef.current = null;
            }
            return;
        }

        // Schedule next alert with random delay between 15-30 seconds
        const scheduleNextAlert = () => {
            const delay = Math.random() * 15000 + 15000; // 15-30 seconds
            alertIntervalRef.current = window.setTimeout(() => {
                addAlert();
                scheduleNextAlert();
            }, delay);
        };

        // Start with initial alert after 5-10 seconds
        alertIntervalRef.current = window.setTimeout(() => {
            addAlert();
            scheduleNextAlert();
        }, Math.random() * 5000 + 5000);

        return () => {
            if (alertIntervalRef.current) {
                clearTimeout(alertIntervalRef.current);
            }
        };
    }, [enabled, addAlert]);

    // Update top IPs when logs change
    useEffect(() => {
        setTopIPs(calculateTopIPs(logs));
    }, [logs, calculateTopIPs]);

    // Stats
    const stats = {
        totalLogs: logs.length,
        logsPerMinute: logsPerSecond * 60,
        activeAlerts: alerts.filter(a => a.status === 'active').length,
        criticalAlerts: alerts.filter(a => a.severity === 'critical' && a.status !== 'resolved').length,
        acknowledgedAlerts: alerts.filter(a => a.status === 'acknowledged').length,
        resolvedAlerts: alerts.filter(a => a.status === 'resolved').length,
    };

    return {
        logs,
        alerts,
        topIPs,
        stats,
        addLog,
        addAlert,
        acknowledgeAlert,
        resolveAlert,
    };
}

export default useLogSimulator;
