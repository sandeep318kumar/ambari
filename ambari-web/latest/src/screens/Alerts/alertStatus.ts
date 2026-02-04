export enum AlertStatus {
    CRITICAL = 'critical',
    WARNING = 'warning',
    OK = 'ok',
    UNKNOWN = 'unknown',
    NONE = 'none'
}

// Map for displaying shortened status text
export const AlertStatusDisplay: { [key: string]: string } = {
    [AlertStatus.CRITICAL]: 'CRIT',
    [AlertStatus.WARNING]: 'WARN',
    [AlertStatus.OK]: 'OK',
    [AlertStatus.UNKNOWN]: 'UNKWN',
    [AlertStatus.NONE]: 'NONE'
};

// Format status for display, preserving original API values
export const formatAlertStatusDisplay = (status: string, count: number = 0): string => {
    const normalizedStatus = status?.toLowerCase();
    const displayText = AlertStatusDisplay[normalizedStatus] || status?.toUpperCase() || 'NONE';
    return count <= 1 ? displayText : `${displayText} (${count})`;
};