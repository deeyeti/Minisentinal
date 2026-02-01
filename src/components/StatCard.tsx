// ============================================
// MiniSentinel — Stat Card Component
// ============================================

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './StatCard.css';

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: number;
    prefix?: string;
    suffix?: string;
    trend?: {
        value: number;
        direction: 'up' | 'down';
    };
    variant?: 'default' | 'success' | 'warning' | 'danger';
    animate?: boolean;
}

export function StatCard({
    icon,
    label,
    value,
    prefix = '',
    suffix = '',
    trend,
    variant = 'default',
    animate = true,
}: StatCardProps) {
    const valueRef = useRef<HTMLSpanElement>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // Counter animation
    useEffect(() => {
        if (!animate || !valueRef.current) return;

        const obj = { val: 0 };

        gsap.to(obj, {
            val: value,
            duration: 2,
            ease: 'power2.out',
            onUpdate: () => {
                if (valueRef.current) {
                    valueRef.current.textContent = `${prefix}${Math.floor(obj.val).toLocaleString()}${suffix}`;
                }
            },
        });
    }, [value, prefix, suffix, animate]);

    // Hover glow animation
    useEffect(() => {
        if (!cardRef.current) return;

        const card = cardRef.current;

        const handleMouseEnter = () => {
            gsap.to(card, {
                scale: 1.02,
                duration: 0.3,
                ease: 'power2.out',
            });
        };

        const handleMouseLeave = () => {
            gsap.to(card, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out',
            });
        };

        card.addEventListener('mouseenter', handleMouseEnter);
        card.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            card.removeEventListener('mouseenter', handleMouseEnter);
            card.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    return (
        <div className={`stat-card ${variant}`} ref={cardRef}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-content">
                <span className="stat-label">{label}</span>
                <span className="stat-value" ref={valueRef}>
                    {animate ? '0' : `${prefix}${value.toLocaleString()}${suffix}`}
                </span>
                {trend && (
                    <span className={`stat-trend ${trend.direction}`}>
                        {trend.direction === 'up' ? '↑' : '↓'} {trend.value}%
                    </span>
                )}
            </div>
            <div className="stat-glow" />
        </div>
    );
}

export default StatCard;
