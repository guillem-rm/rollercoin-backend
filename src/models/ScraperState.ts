export interface ScraperState {
    running: boolean;
    progress: number;
    totalPages: number;
}

export const scraperState: ScraperState = {
    running: false,
    progress: 0,
    totalPages: 0,
};