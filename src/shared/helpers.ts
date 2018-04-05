
export const REDIRECT_WAIT = 3000
export function sleep (time: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, time))
}
