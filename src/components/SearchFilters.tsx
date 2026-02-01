// ============================================
// MiniSentinel — Search Filters Component
// ============================================

import { useState } from 'react';
import { LogFilters, LogLevel, LogSource } from '../types';
import { Search, Filter, X, Calendar } from 'lucide-react';
import './SearchFilters.css';

interface SearchFiltersProps {
    filters: LogFilters;
    onFiltersChange: (filters: LogFilters) => void;
    onClear?: () => void;
}

const LOG_LEVELS: (LogLevel | 'all')[] = ['all', 'error', 'warn', 'info', 'debug'];
const LOG_SOURCES: (LogSource | 'all')[] = ['all', 'auth', 'firewall', 'app', 'database', 'network', 'system'];

export function SearchFilters({
    filters,
    onFiltersChange,
    onClear,
}: SearchFiltersProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);

    const handleSearchChange = (value: string) => {
        onFiltersChange({ ...filters, search: value });
    };

    const handleLevelChange = (value: LogLevel | 'all') => {
        onFiltersChange({ ...filters, level: value });
    };

    const handleSourceChange = (value: LogSource | 'all') => {
        onFiltersChange({ ...filters, source: value });
    };

    const handleIPChange = (value: string) => {
        onFiltersChange({ ...filters, ip: value || undefined });
    };

    const hasActiveFilters =
        filters.search ||
        filters.level !== 'all' ||
        filters.source !== 'all' ||
        filters.ip;

    return (
        <div className="search-filters">
            {/* Main Search */}
            <div className="search-main">
                <div className="search-input-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                        type="text"
                        className="input search-input"
                        placeholder="Search logs by message, IP, or source..."
                        value={filters.search}
                        onChange={(e) => handleSearchChange(e.target.value)}
                    />
                    {filters.search && (
                        <button
                            className="search-clear"
                            onClick={() => handleSearchChange('')}
                        >
                            <X size={14} />
                        </button>
                    )}
                </div>

                <button
                    className={`btn filter-toggle ${showAdvanced ? 'active' : ''}`}
                    onClick={() => setShowAdvanced(!showAdvanced)}
                >
                    <Filter size={16} />
                    Filters
                    {hasActiveFilters && <span className="filter-badge" />}
                </button>
            </div>

            {/* Advanced Filters */}
            {showAdvanced && (
                <div className="filters-advanced">
                    <div className="filter-group">
                        <label className="filter-label">Log Level</label>
                        <div className="filter-options">
                            {LOG_LEVELS.map((level) => (
                                <button
                                    key={level}
                                    className={`filter-option ${filters.level === level ? 'active' : ''} ${level !== 'all' ? `level-${level}` : ''}`}
                                    onClick={() => handleLevelChange(level)}
                                >
                                    {level === 'all' ? 'All' : level.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Source</label>
                        <select
                            className="input filter-select"
                            value={filters.source}
                            onChange={(e) => handleSourceChange(e.target.value as LogSource | 'all')}
                        >
                            {LOG_SOURCES.map((source) => (
                                <option key={source} value={source}>
                                    {source === 'all' ? 'All Sources' : source.charAt(0).toUpperCase() + source.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">IP Address</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g., 192.168.1.1"
                            value={filters.ip || ''}
                            onChange={(e) => handleIPChange(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <label className="filter-label">Time Range</label>
                        <div className="time-range">
                            <button className="btn btn-small">
                                <Calendar size={14} />
                                Last 24 Hours
                            </button>
                        </div>
                    </div>

                    {hasActiveFilters && (
                        <button
                            className="btn btn-danger clear-filters"
                            onClick={onClear}
                        >
                            <X size={14} />
                            Clear All Filters
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}

export default SearchFilters;
