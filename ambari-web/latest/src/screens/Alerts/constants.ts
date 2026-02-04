import {AlertStatus} from "./alertStatus.ts";

export const STATUS_PRIORITY_ORDER = ['unknown', 'ok', 'warning', 'critical'];

export const ALERT_SEARCH_CATEGORIES = [
    'Status',
    'Alert Definition Name',
    'Service',
    'Last Status Changed',
    'State',
    'Group',
] as const;

export const TIME_RANGES = {
    'Past 1 hour': 1,
    'Past 1 day': 24,
    'Past 2 days': 48,
    'Past 7 days': 168,
    'Past 14 days': 336,
    'Past 30 days': 720
} as const;

export const STATUS_OPTIONS = [
    AlertStatus.OK,
    AlertStatus.WARNING,
    AlertStatus.CRITICAL,
    AlertStatus.UNKNOWN
] as const;