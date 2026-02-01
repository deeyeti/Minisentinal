// ============================================
// MiniSentinel — Logs Explorer Page
// ============================================

import { useState, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { FileText, Download, RefreshCw } from 'lucide-react';
import { Log, LogFilters } from '../types';
import { useLogSimulator } from '../hooks/useLogSimulator';
import { SearchFilters } from '../components/SearchFilters';
import './LogsExplorer.css';

const DEFAULT_FILTERS: LogFilters = {
    search: '',
    level: 'all',
    source: 'all',
};

function formatTimestamp(date: Date): string {
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
}

export function LogsExplorer() {
    const { logs } = useLogSimulator({ logsPerSecond: 1 });
    const [filters, setFilters] = useState<LogFilters>(DEFAULT_FILTERS);
    const [selectedLog, setSelectedLog] = useState<Log | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 50;

    const headerRef = useRef<HTMLDivElement>(null);
    const tableRef = useRef<HTMLDivElement>(null);

    // Entrance animation
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.fromTo(
                headerRef.current,
                { opacity: 0, y: -20 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }
            );

            gsap.fromTo(
                tableRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', delay: 0.2 }
            );
        });

        return () => ctx.revert();
    }, []);

    // Filter logs
    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            // Search filter
            if (filters.search) {
                const searchLower = filters.search.toLowerCase();
                const matches =
                    log.message.toLowerCase().includes(searchLower) ||
                    log.ip.includes(filters.search) ||
                    log.source.toLowerCase().includes(searchLower);
                if (!matches) return false;
            }

            // Level filter
            if (filters.level !== 'all' && log.level !== filters.level) {
                return false;
            }

            // Source filter
            if (filters.source !== 'all' && log.source !== filters.source) {
                return false;
            }

            // IP filter
            if (filters.ip && !log.ip.includes(filters.ip)) {
                return false;
            }

            return true;
        });
    }, [logs, filters]);

    // Pagination
    const totalPages = Math.ceil(filteredLogs.length / pageSize);
    const paginatedLogs = filteredLogs.slice((page - 1) * pageSize, page * pageSize);

    const handleClearFilters = () => {
        setFilters(DEFAULT_FILTERS);
        setPage(1);
    };

    return (
        <div className="logs-explorer">
            {/* Header */}
            <header className="page-header" ref={headerRef}>
                <div className="header-content">
                    <h1>
                        <FileText size={32} />
                        Logs Explorer
                    </h1>
                    <p className="header-subtitle">
                        Search and analyze collected logs across all sources
                    </p>
                </div>
                <div className="header-actions">
                    <button className="btn">
                        <RefreshCw size={16} />
                        Refresh
                    </button>
                    <button className="btn">
                        <Download size={16} />
                        Export
                    </button>
                </div>
            </header>

            {/* Search & Filters */}
            <section className="filters-section">
                <SearchFilters
                    filters={filters}
                    onFiltersChange={(newFilters) => {
                        setFilters(newFilters);
                        setPage(1);
                    }}
                    onClear={handleClearFilters}
                />
            </section>

            {/* Results Summary */}
            <div className="results-summary">
                <span>
                    Showing {paginatedLogs.length} of {filteredLogs.length.toLocaleString()} logs
                </span>
                {filters.search || filters.level !== 'all' || filters.source !== 'all' ? (
                    <span className="filtered-label">Filtered</span>
                ) : null}
            </div>

            {/* Logs Table */}
            <div className="logs-table-wrapper" ref={tableRef}>
                <table className="logs-table">
                    <thead>
                        <tr>
                            <th>Timestamp</th>
                            <th>Source</th>
                            <th>Level</th>
                            <th>IP Address</th>
                            <th>Message</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLogs.map(log => (
                            <tr
                                key={log.id}
                                className={`level-row-${log.level} ${selectedLog?.id === log.id ? 'selected' : ''}`}
                                onClick={() => setSelectedLog(log)}
                            >
                                <td className="col-timestamp">{formatTimestamp(log.timestamp)}</td>
                                <td className="col-source">
                                    <span className="source-badge">{log.source}</span>
                                </td>
                                <td className="col-level">
                                    <span className={`level-badge level-${log.level}`}>
                                        {log.level.toUpperCase()}
                                    </span>
                                </td>
                                <td className="col-ip">{log.ip}</td>
                                <td className="col-message">{log.message}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {paginatedLogs.length === 0 && (
                    <div className="table-empty">
                        <FileText size={48} />
                        <p>No logs match your filters</p>
                        <button className="btn" onClick={handleClearFilters}>
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        className="btn btn-small"
                        disabled={page === 1}
                        onClick={() => setPage(p => p - 1)}
                    >
                        Previous
                    </button>
                    <span className="page-info">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        className="btn btn-small"
                        disabled={page === totalPages}
                        onClick={() => setPage(p => p + 1)}
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Log Detail Modal */}
            {selectedLog && (
                <div className="log-detail-overlay" onClick={() => setSelectedLog(null)}>
                    <div className="log-detail-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>Log Details</h3>
                            <button className="modal-close" onClick={() => setSelectedLog(null)}>×</button>
                        </div>
                        <div className="modal-content">
                            <div className="detail-row">
                                <span className="detail-label">ID</span>
                                <span className="detail-value">{selectedLog.id}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Timestamp</span>
                                <span className="detail-value">{formatTimestamp(selectedLog.timestamp)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Source</span>
                                <span className="detail-value">{selectedLog.source}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Level</span>
                                <span className={`level-badge level-${selectedLog.level}`}>
                                    {selectedLog.level.toUpperCase()}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">IP Address</span>
                                <span className="detail-value">{selectedLog.ip}</span>
                            </div>
                            <div className="detail-row full-width">
                                <span className="detail-label">Message</span>
                                <span className="detail-value message">{selectedLog.message}</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LogsExplorer;
