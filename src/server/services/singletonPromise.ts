
export function singletonPromise<T> (createPromise: () => Promise<T>): () => Promise<T> {
  let storedPromise: Promise<T> | undefined

  return () => {
    if (!storedPromise) {
      storedPromise = createPromise()
    }

    return storedPromise
  }
}
