/**
 * Cache utility for storing and retrieving data with TTL support
 * Uses both memory and sessionStorage for persistence
 */

class CacheManager {
  constructor() {
    this.memoryCache = new Map()
    this.defaultTTL = 5 * 60 * 1000 // 5 minutes in milliseconds
  }

  /**
   * Generate cache key with optional namespace
   */
  generateKey(key, namespace = 'app') {
    return `${namespace}:${key}`
  }

  /**
   * Set cache item with TTL
   */
  set(key, data, ttl = this.defaultTTL, namespace = 'app') {
    const cacheKey = this.generateKey(key, namespace)
    const item = {
      data,
      timestamp: Date.now(),
      ttl
    }

    // Store in memory
    this.memoryCache.set(cacheKey, item)

    // Store in sessionStorage for persistence across page reloads
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(item))
    } catch (error) {
      console.warn('Failed to store in sessionStorage:', error)
    }

    // Set cleanup timer
    if (ttl > 0) {
      setTimeout(() => {
        this.delete(key, namespace)
      }, ttl)
    }
  }

  /**
   * Get cache item with TTL check
   */
  get(key, namespace = 'app') {
    const cacheKey = this.generateKey(key, namespace)
    
    // Try memory cache first
    let item = this.memoryCache.get(cacheKey)

    // If not in memory, try sessionStorage
    if (!item) {
      try {
        const stored = sessionStorage.getItem(cacheKey)
        if (stored) {
          item = JSON.parse(stored)
          // Restore to memory cache
          this.memoryCache.set(cacheKey, item)
        }
      } catch (error) {
        console.warn('Failed to parse cached item:', error)
        return null
      }
    }

    if (!item) return null

    // Check if expired
    const now = Date.now()
    if (item.ttl > 0 && (now - item.timestamp) > item.ttl) {
      this.delete(key, namespace)
      return null
    }

    return item.data
  }

  /**
   * Delete cache item
   */
  delete(key, namespace = 'app') {
    const cacheKey = this.generateKey(key, namespace)
    this.memoryCache.delete(cacheKey)
    
    try {
      sessionStorage.removeItem(cacheKey)
    } catch (error) {
      console.warn('Failed to remove from sessionStorage:', error)
    }
  }

  /**
   * Check if item exists and is valid
   */
  has(key, namespace = 'app') {
    return this.get(key, namespace) !== null
  }

  /**
   * Clear all cache items for a namespace
   */
  clearNamespace(namespace = 'app') {
    const prefix = `${namespace}:`
    
    // Clear memory cache
    for (const key of this.memoryCache.keys()) {
      if (key.startsWith(prefix)) {
        this.memoryCache.delete(key)
      }
    }

    // Clear sessionStorage
    try {
      const keysToRemove = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && key.startsWith(prefix)) {
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key))
    } catch (error) {
      console.warn('Failed to clear sessionStorage namespace:', error)
    }
  }

  /**
   * Clear all cache
   */
  clearAll() {
    this.memoryCache.clear()
    try {
      // Only clear cache items, not other sessionStorage data
      const keysToRemove = []
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && key.includes(':')) { // Our cache keys always have namespace:key format
          keysToRemove.push(key)
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key))
    } catch (error) {
      console.warn('Failed to clear sessionStorage:', error)
    }
  }

  /**
   * Get cache statistics
   */
  getStats() {
    return {
      memorySize: this.memoryCache.size,
      sessionStorageKeys: this.getSessionStorageKeys().length
    }
  }

  /**
   * Get all cache keys from sessionStorage
   */
  getSessionStorageKeys() {
    const cacheKeys = []
    try {
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i)
        if (key && key.includes(':')) {
          cacheKeys.push(key)
        }
      }
    } catch (error) {
      console.warn('Failed to read sessionStorage keys:', error)
    }
    return cacheKeys
  }

  /**
   * Memoize function with caching
   */
  memoize(fn, keyGenerator, ttl = this.defaultTTL, namespace = 'memoize') {
    return async (...args) => {
      const key = keyGenerator ? keyGenerator(...args) : JSON.stringify(args)
      
      // Try cache first
      const cached = this.get(key, namespace)
      if (cached !== null) {
        return cached
      }

      // Execute function and cache result
      try {
        const result = await fn(...args)
        this.set(key, result, ttl, namespace)
        return result
      } catch (error) {
        // Don't cache errors
        throw error
      }
    }
  }
}

// Create global cache instance
const cache = new CacheManager()

// Export specific cache instances for different data types
export const apiCache = {
  set: (key, data, ttl) => cache.set(key, data, ttl, 'api'),
  get: (key) => cache.get(key, 'api'),
  delete: (key) => cache.delete(key, 'api'),
  has: (key) => cache.has(key, 'api'),
  clear: () => cache.clearNamespace('api')
}

export const userCache = {
  set: (key, data, ttl) => cache.set(key, data, ttl, 'user'),
  get: (key) => cache.get(key, 'user'),
  delete: (key) => cache.delete(key, 'user'),
  has: (key) => cache.has(key, 'user'),
  clear: () => cache.clearNamespace('user')
}

export const resumeCache = {
  set: (key, data, ttl) => cache.set(key, data, ttl, 'resume'),
  get: (key) => cache.get(key, 'resume'),
  delete: (key) => cache.delete(key, 'resume'),
  has: (key) => cache.has(key, 'resume'),
  clear: () => cache.clearNamespace('resume')
}

export const templateCache = {
  set: (key, data, ttl) => cache.set(key, data, ttl, 'template'),
  get: (key) => cache.get(key, 'template'),
  delete: (key) => cache.delete(key, 'template'),
  has: (key) => cache.has(key, 'template'),
  clear: () => cache.clearNamespace('template')
}

export default cache