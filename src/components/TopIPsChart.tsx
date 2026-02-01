// ============================================
// MiniSentinel — Top IPs Chart Component
// ============================================

import { useEffect, useRef } from 'react';
import { TopIP } from '../types';
import gsap from 'gsap';
import './TopIPsChart.css';

interface TopIPsChartProps {
    data: TopIP[];
    title?: string;
    maxItems?: number;
}

function getThreatLevel(score: number): 'critical' | 'high' | 'medium' | 'low' {
    if (score >= 80) return 'critical';
    if (score >= 60) return 'high';
    if (score >= 40) return 'medium';
    return 'low';
}

export function TopIPsChart({
    data,
    title = 'Top IPs by Request Count',
    maxItems = 5,
}: TopIPsChartProps) {
    const barsRef = useRef<HTMLDivElement>(null);

    const sortedData = [...data]
        .sort((a, b) => b.requestCount - a.requestCount)
        .slice(0, maxItems);

    const maxCount = Math.max(...sortedData.map(d => d.requestCount), 1);

    // Animate bars on mount
    useEffect(() => {
        if (!barsRef.current) return;

        const bars = barsRef.current.querySelectorAll('.ip-bar-fill');

        gsap.fromTo(
            bars,
            { width: 0 },
            {
                width: (index) => `${(sortedData[index].requestCount / maxCount) * 100}%`,
                duration: 1,
                stagger: 0.1,
                ease: 'power3.out',
                delay: 0.2,
            }
        );
    }, [sortedData, maxCount]);

    return (
        <div className="top-ips-chart">
            <div className="chart-header">
                <h3>{title}</h3>
            </div>

            <div className="ip-bars" ref={barsRef}>
                {sortedData.map((ip, index) => {
                    const percentage = (ip.requestCount / maxCount) * 100;
                    const threatLevel = getThreatLevel(ip.threatScore);

                    return (
                        <div key={ip.ip} className="ip-row">
                            <div className="ip-info">
                                <span className="ip-rank">#{index + 1}</span>
                                <span className="ip-address">{ip.ip}</span>
                                <span className={`ip-threat threat-${threatLevel}`}>
                                    {ip.threatScore}%
                                </span>
                            </div>

                            <div className="ip-bar">
                                <div
                                    className={`ip-bar-fill threat-${threatLevel}`}
                                    style={{ '--target-width': `${percentage}%` } as React.CSSProperties}
                                />
                                <span className="ip-count">
                                    {ip.requestCount.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    );
                })}

                {sortedData.length === 0 && (
                    <div className="chart-empty">No IP data available</div>
                )}
            </div>
        </div>
    );
}

export default TopIPsChart;
