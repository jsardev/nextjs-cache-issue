import memoize, { Memoized, RawKey } from "micro-memoize";
import { log } from "./utils";

/**
 * A static cache manager service that provides caching and memoization functionality.
 */
export class StorageService {
  private static cache: Map<string, any> = new Map<string, any>();

  /**
   * Retrieves a value from the cache by key.
   * @param key The cache key
   * @returns The cached value or undefined if not found
   */
  public static get = memoize(<T>(key: string): Promise<T | undefined> => {
    const value = this.cache.get(key) as T;
    log("executing get", { key, value });
    return Promise.resolve(value);
  });

  /**
   * Stores a value in the cache with the specified key.
   * @param key The cache key
   * @param value The value to cache
   */
  public static set = memoize(
    async <T>(key: string, value: T): Promise<void> => {
      log("executing set", { key, value });
      this.cache.set(key, value);
    },
  );

  /**
   * Creates a memoized version of the provided function along with a revalidation function.
   * The function's result will be cached using the provided key.
   *
   * @param fn The function to memoize
   * @param key The cache key to use for this function
   * @returns A tuple containing [memoizedFunction, revalidateFunction]
   */
  public static wrap<T, A extends Array<unknown>>(
    fn: (...args: A) => Promise<T>,
    key: string,
  ): [Memoized<(...args: A) => Promise<T>>, (...args: A) => Promise<T>] {
    const revalidateFn = async (...args: A): Promise<T> => {
      log("executing revalidate fn");
      const result = await fn(...args);
      log("revalidate result", { result });
      if (result) {
        await this.set(key, result);
      }
      return result;
    };

    const cachedFn = memoize(async (...args: A): Promise<T> => {
      log("executing cached fn");
      const existing = await this.get<T>(key);
      log("cached fn result", { key, existing });
      if (existing !== undefined) {
        return existing;
      }
      return revalidateFn(...args);
    });

    return [cachedFn, revalidateFn];
  }

  /**
   * Clears all entries from the cache.
   */
  public static clear(): void {
    this.cache.clear();
  }

  /**
   * Deletes a specific entry from the cache.
   * @param key The key to remove from the cache
   * @returns true if the element was removed, false if it wasn't found
   */
  public static delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Checks if a key exists in the cache.
   * @param key The key to check
   * @returns true if the key exists, false otherwise
   */
  public static has(key: string): boolean {
    return this.cache.has(key);
  }
}
