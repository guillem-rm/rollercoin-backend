export interface ScraperState {
    running: boolean;
    progress: number;
    totalPages: number;
    miners: any[];
}

export const scraperState: ScraperState = {
    running: false,
    progress: 0,
    totalPages: 0,
    miners: [],
};