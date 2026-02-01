// ============================================
// MiniSentinel — Rules Configuration Page
// ============================================

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Shield, ToggleLeft, ToggleRight, Info, Zap, AlertTriangle, Search } from 'lucide-react';
import { DETECTION_RULES, getRuleStats } from '../data/rules';
import { Rule } from '../types';
import './RulesConfig.css';

function getSeverityColor(severity: string): string {
    switch (severity) {
        case 'critical': return 'var(--accent-red)';
        case 'high': return 'var(--accent-yellow)';
        case 'medium': return 'var(--accent-cyan)';
        case 'low': return 'var(--accent-green)';
        default: return 'var(--text-secondary)';
    }
}

function getRuleIcon(name: string) {
    if (name.toLowerCase().includes('ddos') || name.toLowerCase().includes('force')) {
        return <Zap size={20} />;
    }
    if (name.toLowerCase().includes('suspicious') || name.toLowerCase().includes('injection')) {
        return <AlertTriangle size={20} />;
    }
    if (name.toLowerCase().includes('access') || name.toLowerCase().includes('escalation')) {
        return <Search size={20} />;
    }
    return <Shield size={20} />;
}

export function RulesConfig() {
    const [rules, setRules] = useState<Rule[]>(DETECTION_RULES);
    const [selectedRule, setSelectedRule] = useState<Rule | null>(null);

    const headerRef = useRef<HTMLDivElement>(null);
    const rulesRef = useRef<HTMLDivElement>(null);

    const stats = getRuleStats();

    // Entrance animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );

            if (rulesRef.current) {
                gsap.fromTo(
                    rulesRef.current.children,
                    { opacity: 0, y: 30, scale: 0.98 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.5,
                        stagger: 0.08,
                        ease: 'power2.out',
                        delay: 0.2
                    }
                );
            }
        });

        return () => ctx.revert();
    }, []);

    const toggleRule = (ruleId: string) => {
        setRules(prev => prev.map(rule =>
            rule.id === ruleId ? { ...rule, enabled: !rule.enabled } : rule
        ));
    };

    return (
        <div className="rules-config">
            {/* Header */}
            <header className="page-header" ref={headerRef}>
                <div className="header-content">
                    <h1>
                        <Shield size={32} />
                        Detection Rules
                    </h1>
                    <p className="header-subtitle">
                        Configure and manage threat detection rules
                    </p>
                </div>

                {/* Stats */}
                <div className="rules-stats">
                    <div className="stat-item">
                        <span className="stat-value">{stats.active}</span>
                        <span className="stat-label">Active Rules</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item">
                        <span className="stat-value">{stats.totalHits.toLocaleString()}</span>
                        <span className="stat-label">Total Hits</span>
                    </div>
                    <div className="stat-divider" />
                    <div className="stat-item severity">
                        <span className="severity-breakdown">
                            <span className="dot critical" />{stats.bySeverity.critical}
                            <span className="dot high" />{stats.bySeverity.high}
                            <span className="dot medium" />{stats.bySeverity.medium}
                            <span className="dot low" />{stats.bySeverity.low}
                        </span>
                        <span className="stat-label">By Severity</span>
                    </div>
                </div>
            </header>

            {/* Rules Grid */}
            <div className="rules-grid" ref={rulesRef}>
                {rules.map(rule => (
                    <div
                        key={rule.id}
                        className={`rule-card ${rule.enabled ? 'enabled' : 'disabled'}`}
                        style={{ '--severity-color': getSeverityColor(rule.severity) } as React.CSSProperties}
                    >
                        <div className="rule-header">
                            <div className="rule-icon">
                                {getRuleIcon(rule.name)}
                            </div>
                            <div className="rule-title-group">
                                <h3 className="rule-name">{rule.name}</h3>
                                <span className={`rule-severity severity-${rule.severity}`}>
                                    {rule.severity}
                                </span>
                            </div>
                            <button
                                className={`toggle-btn ${rule.enabled ? 'on' : 'off'}`}
                                onClick={() => toggleRule(rule.id)}
                                aria-label={rule.enabled ? 'Disable rule' : 'Enable rule'}
                            >
                                {rule.enabled ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                            </button>
                        </div>

                        <p className="rule-description">{rule.description}</p>

                        <div className="rule-footer">
                            <div className="rule-condition">
                                <code>
                                    {rule.condition.field} {rule.condition.operator} {rule.condition.value}
                                    {rule.condition.timeWindowSeconds && ` / ${rule.condition.timeWindowSeconds}s`}
                                </code>
                            </div>
                            <div className="rule-stats">
                                <span className="hit-count">
                                    <Zap size={12} />
                                    {rule.hitCount} hits
                                </span>
                                <button
                                    className="info-btn"
                                    onClick={() => setSelectedRule(rule)}
                                >
                                    <Info size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Rule Detail Modal */}
            {selectedRule && (
                <div className="rule-detail-overlay" onClick={() => setSelectedRule(null)}>
                    <div className="rule-detail-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Rule Configuration</h3>
                            <button className="modal-close" onClick={() => setSelectedRule(null)}>×</button>
                        </div>
                        <div className="modal-content">
                            <div className="rule-detail-header">
                                <div className="rule-icon large">
                                    {getRuleIcon(selectedRule.name)}
                                </div>
                                <div>
                                    <h2>{selectedRule.name}</h2>
                                    <span className={`rule-severity severity-${selectedRule.severity}`}>
                                        {selectedRule.severity} Severity
                                    </span>
                                </div>
                            </div>

                            <p className="rule-description">{selectedRule.description}</p>

                            <div className="config-section">
                                <h4>Rule Condition</h4>
                                <div className="condition-display">
                                    <div className="condition-row">
                                        <span className="condition-label">Field</span>
                                        <code>{selectedRule.condition.field}</code>
                                    </div>
                                    <div className="condition-row">
                                        <span className="condition-label">Operator</span>
                                        <code>{selectedRule.condition.operator}</code>
                                    </div>
                                    <div className="condition-row">
                                        <span className="condition-label">Threshold</span>
                                        <code>{selectedRule.condition.value}</code>
                                    </div>
                                    {selectedRule.condition.timeWindowSeconds && (
                                        <div className="condition-row">
                                            <span className="condition-label">Time Window</span>
                                            <code>{selectedRule.condition.timeWindowSeconds} seconds</code>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="config-section">
                                <h4>Statistics</h4>
                                <div className="stats-display">
                                    <div className="stat-box">
                                        <span className="stat-value">{selectedRule.hitCount}</span>
                                        <span className="stat-label">Total Hits</span>
                                    </div>
                                    <div className="stat-box">
                                        <span className="stat-value">{selectedRule.enabled ? 'Active' : 'Disabled'}</span>
                                        <span className="stat-label">Status</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RulesConfig;
