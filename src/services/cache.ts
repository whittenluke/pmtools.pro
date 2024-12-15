export class CacheService {
  private static instance: CacheService;
  private cache: Map<string, any>;

  private constructor() {
    this.cache = new Map();
  }

  static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  set(key: string, value: any, ttl: number = 300000): void {
    this.cache.set(key, {
      value,
      expiry: Date.now() + ttl,
    });
  }

  get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  invalidate(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }
}