/* eslint-disable @typescript-eslint/no-explicit-any */

export class Logger {
	public info(...args: any[]) {
		console.log(`[INFO] ℹ️`, ...args)
	}
	public warn(...args: any[]) {
		console.warn(`[WARN] ⚠️`, ...args)
	}
	public error(...args: any[]) {
		console.error(`[ERROR] ‼️`, ...args)
	}
}

export const log = Logger
