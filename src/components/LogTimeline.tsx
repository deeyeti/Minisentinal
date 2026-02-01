// ============================================
// MiniSentinel — Log Timeline Component
// ============================================

import { useEffect, useRef } from 'react';
import { Log } from '../types';
import gsap from 'gsap';
import './LogTimeline.css';

interface LogTimelineProps {
    logs: Log[];
    maxItems?: number;
    onLogClick?: (log: Log) => void;
    animate?: boolean;
}

function formatTimestamp(date: Date): string {
    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
}

function getLevelClass(level: string): string {
    switch (level) {
        case 'error': return 'level-error';
        case 'warn': return 'level-warn';
        case 'info': return 'level-info';
        case 'debug': return 'level-debug';
        default: return '';
    }
}

function getSourceColor(source: string): string {
    const colors: Record<string, string> = {
        auth: '#ff6b6b',
        firewall: '#4ecdc4',
        app: '#45b7d1',
        database: '#96ceb4',
        network: '#ffeaa7',
        system: '#dfe6e9',
    };
    return colors[source] || '#888888';
}

export function LogTimeline({
    logs,
    maxItems = 50,
    onLogClick,
    animate = true,
}: LogTimelineProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const prevLogCountRef = useRef(logs.length);

    // Animate new log entries
    useEffect(() => {
        if (!animate || !containerRef.current) return;

        const newLogsCount = logs.length - prevLogCountRef.current;

        if (newLogsCount > 0) {
            const newItems = containerRef.current.querySelectorAll('.log-entry:nth-child(-n+' + newLogsCount + ')');

            gsap.fromTo(
                newItems,
                { opacity: 0, x: -20, backgroundColor: 'rgba(0, 255, 255, 0.1)' },
                {
                    opacity: 1,
                    x: 0,
                    backgroundColor: 'transparent',
                    duration: 0.4,
                    stagger: 0.05,
                    ease: 'power2.out',
                }
            );
        }

        prevLogCountRef.current = logs.length;
    }, [logs.length, animate]);

    const displayLogs = logs.slice(0, maxItems);

    return (
        <div className="log-timeline">
            <div className="log-timeline-header">
                <h3>Live Log Stream</h3>
                <span className="log-count">{logs.length.toLocaleString()} entries</span>
            </div>

            <div className="log-entries" ref={containerRef}>
                {displayLogs.map((log) => (
                    <div
                        key={log.id}
                        className={`log-entry ${getLevelClass(log.level)}`}
                        onClick={() => onLogClick?.(log)}
                    >
                        <span className="log-time">{formatTimestamp(log.timestamp)}</span>
                        <span
                            className="log-source"
                            style={{ '--source-color': getSourceColor(log.source) } as React.CSSProperties}
                        >
                            {log.source}
                        </span>
                        <span className={`log-level ${getLevelClass(log.level)}`}>
                            {log.level.toUpperCase()}
                        </span>
                        <span className="log-ip">{log.ip}</span>
                        <span className="log-message">{log.message}</span>
                    </div>
                ))}

                {displayLogs.length === 0 && (
                    <div className="log-empty">
                        <span>No logs to display</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default LogTimeline;
