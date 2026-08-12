export interface MaintenanceHistoryResponse {
    repairDate: string;
    repairDescription: string;
    unusableDate: string;
    breakdownReason: string;
    cost: number;
    user: {
        name: string;
        surname: string;
    };
}