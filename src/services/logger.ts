/* eslint-disable @typescript-eslint/no-explicit-any */

class Logger {
	private static getLocation(): string {
		try {
			const stack = new Error().stack?.split('\n')[3]
			const match = stack?.match(/\((.*):(\d+):(\d+)\)/)
			return match ? `${match[1]}:${match[2]}:${match[3]}` : 'unknown location'
		} catch {
			return 'unknown location'
		}
	}

	public static info(...args: any[]) {
		console.log(`[INFO] [${Logger.getLocation()}] ℹ️`, ...args)
	}
	public static warn(...args: any[]) {
		console.warn(`[WARN] [${Logger.getLocation()}] ⚠️`, ...args)
	}
	public static error(...args: any[]) {
		console.error(`[ERROR] [${Logger.getLocation()}] ‼️`, ...args)
	}
}

export const log = Logger
