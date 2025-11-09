/**
 * Helper functions for time-related utilities.
 */

/**
 * Pauses execution for a specified number of milliseconds.
 * 
 * @param ms Number of milliseconds to wait
 * @returns Promise that resolves after the delay
 */
export const wait = (ms: number) => new Promise(res => setTimeout(res, ms));