import { useState, useEffect, useCallback } from 'react'
import { useCache } from '../components/Cache/CacheProvider'
import { apiCache } from '../utils/cache'

/**
 * Hook for making cached API calls with loading states
 */
export const useCachedQuery = (key, queryFn, options = {}) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  const {
    enabled = true,
    staleTime = 5 * 60 * 1000, // 5 minutes
    cacheTime = 10 * 60 * 1000, // 10 minutes
    refetchOnMount = false,
    onSuccess,
    onError
  } = options

  const { cache } = useCache()

  const executeQuery = useCallback(async (forceFresh = false) => {
    if (!enabled) return

    setLoading(true)
    setError(null)

    try {
      // Check cache first unless forcing fresh data
      if (!forceFresh) {
        const cached = apiCache.get(key)
        if (cached) {
          setData(cached)
          setLoading(false)
          onSuccess?.(cached)
          return cached
        }
      }

      // Execute the query function
      const result = await queryFn()
      
      // Cache the result
      apiCache.set(key, result, cacheTime)
      
      setData(result)
      setLoading(false)
      onSuccess?.(result)
      
      return result
    } catch (err) {
      setError(err)
      setLoading(false)
      onError?.(err)
      throw err
    }
  }, [key, queryFn, enabled, cacheTime, onSuccess, onError])

  // Initial fetch
  useEffect(() => {
    if (enabled) {
      executeQuery(refetchOnMount)
    }
  }, [executeQuery, enabled, refetchOnMount])

  const refetch = useCallback(() => {
    return executeQuery(true)
  }, [executeQuery])

  const invalidate = useCallback(() => {
    apiCache.delete(key)
  }, [key])

  return {
    data,
    loading,
    error,
    refetch,
    invalidate,
    isStale: () => {
      const cached = apiCache.get(key)
      return !cached
    }
  }
}

/**
 * Hook for caching mutation results
 */
export const useCachedMutation = (mutationFn, options = {}) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const {
    onSuccess,
    onError,
    invalidateKeys = [],
    updateCache = []
  } = options

  const { invalidateResumeCache } = useCache()

  const mutate = useCallback(async (variables) => {
    setLoading(true)
    setError(null)

    try {
      const result = await mutationFn(variables)
      
      // Invalidate specified cache keys
      invalidateKeys.forEach(key => {
        apiCache.delete(key)
      })

      // Update cache entries
      updateCache.forEach(({ key, updater }) => {
        const cached = apiCache.get(key)
        if (cached) {
          const updated = updater(cached, result, variables)
          apiCache.set(key, updated)
        }
      })

      // Auto-invalidate resume cache if this looks like a resume mutation
      if (variables?.id || variables?.resumeId) {
        invalidateResumeCache(variables.id || variables.resumeId)
      }

      setLoading(false)
      onSuccess?.(result, variables)
      
      return result
    } catch (err) {
      setError(err)
      setLoading(false)
      onError?.(err, variables)
      throw err
    }
  }, [mutationFn, invalidateKeys, updateCache, onSuccess, onError, invalidateResumeCache])

  return {
    mutate,
    loading,
    error
  }
}

/**
 * Hook for prefetching data
 */
export const usePrefetch = () => {
  const prefetch = useCallback(async (key, queryFn, cacheTime = 5 * 60 * 1000) => {
    // Check if already cached
    if (apiCache.has(key)) {
      return apiCache.get(key)
    }

    try {
      const result = await queryFn()
      apiCache.set(key, result, cacheTime)
      return result
    } catch (error) {
      console.warn('Prefetch failed for key:', key, error)
      return null
    }
  }, [])

  return { prefetch }
}

/**
 * Hook for cache statistics and management
 */
export const useCacheStats = () => {
  const { getCacheStats, clearApiCache, clearAllCache } = useCache()
  const [stats, setStats] = useState(null)

  const refreshStats = useCallback(() => {
    const currentStats = getCacheStats()
    setStats(currentStats)
    return currentStats
  }, [getCacheStats])

  useEffect(() => {
    refreshStats()
    
    // Update stats every 30 seconds
    const interval = setInterval(refreshStats, 30000)
    return () => clearInterval(interval)
  }, [refreshStats])

  return {
    stats,
    refreshStats,
    clearApiCache,
    clearAllCache
  }
}

export default {
  useCachedQuery,
  useCachedMutation,
  usePrefetch,
  useCacheStats
}