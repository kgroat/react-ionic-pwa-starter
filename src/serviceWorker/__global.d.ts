
declare namespace WorkBox {

  interface CacheStrategyOpts {
    cacheName?: string
    plugins?: string
  }
  interface FetchStrategyOpts extends CacheStrategyOpts {
    fetchOptions?: RequestInit
  }

  abstract class NetworkStrategy<TOpts extends CacheStrategyOpts> {
    new (opts?: TOpts): NetworkStrategy<TOpts>
    handle (inputs: { event: FetchEvent }): Promise<Response>
  }

  interface CacheStrategyHandler<TOpts extends CacheStrategyOpts> {
    (opts?: TOpts): NetworkStrategy<TOpts>
  }

  interface Strategies {
    cacheFirst: CacheStrategyHandler<FetchStrategyOpts>
    cacheOnly: CacheStrategyHandler<CacheStrategyOpts>
    networkFirst: CacheStrategyHandler<{ networkTimeoutSeconds?: number } & FetchStrategyOpts>
    networkOnly: CacheStrategyHandler<FetchStrategyOpts>
    staleWhileRevalidate: CacheStrategyHandler<FetchStrategyOpts>

    CacheFirst: NetworkStrategy<FetchStrategyOpts>
    CacheOnly: NetworkStrategy<CacheStrategyOpts>
    NetworkFirst: NetworkStrategy<{ networkTimeoutSeconds?: number } & FetchStrategyOpts>
    NetworkOnly: NetworkStrategy<FetchStrategyOpts>
    StaleWhileRevalidate: NetworkStrategy<FetchStrategyOpts>
  }

  interface Precaching {
    precacheAndRoute (list: string[], options?: any): void
  }

  interface Routing {
    registerRoute (expr: RegExp, strategy: NetworkStrategy<any>)
  }

  interface WorkBox {
    skipWaiting (): void
    clientsClaim (): void
    strategies: Strategies
    precaching: Precaching
    routing: Routing
  }
}

interface ServiceWorkerGlobalScope {
  workbox: WorkBox.WorkBox
}

declare const workbox: WorkBox.WorkBox
