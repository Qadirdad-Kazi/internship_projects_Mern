import React, { createContext, useContext, useEffect, useCallback } from 'react'
import cache, { apiCache, userCache, resumeCache, templateCache } from '../../utils/cache'

const CacheContext = createContext()

export const useCache = () => {
  const context = useContext(CacheContext)
  if (!context) {
    throw new Error('useCache must be used within a CacheProvider')
  }
  return context
}

export const CacheProvider = ({ children }) => {
  // Cache cleanup on app start
  useEffect(() => {
    // Clean up expired cache entries on app initialization
    const cleanup = () => {
      // This will be handled automatically by the cache TTL system
      console.log('Cache system initialized')
    }
    
    cleanup()
  }, [])

  // Cache management functions
  const clearUserCache = useCallback(() => {
    userCache.clear()
  }, [])

  const clearResumeCache = useCallback(() => {
    resumeCache.clear()
  }, [])

  const clearApiCache = useCallback(() => {
    apiCache.clear()
  }, [])

  const clearAllCache = useCallback(() => {
    cache.clearAll()
  }, [])

  const invalidateResumeCache = useCallback((resumeId) => {
    resumeCache.delete(`resume_${resumeId}`)
    resumeCache.delete('resumes_list')
    apiCache.delete(`/resumes/${resumeId}`)
    apiCache.delete('/resumes')
  }, [])

  const prefetchResume = useCallback(async (resumeId) => {
    try {
      // This would be used to prefetch resume data
      const cacheKey = 'resume_' + resumeId
      if (!resumeCache.has(cacheKey)) {
        // Prefetch logic would go here
        console.log('Prefetching resume ' + resumeId)
      }
    } catch (error) {
      console.warn('Failed to prefetch resume:', error)
    }
  }, [])

  const getCacheStats = useCallback(() => {
    return {
      ...cache.getStats(),
      apiCacheSize: apiCache.getStats ? apiCache.getStats() : 0,
      userCacheSize: userCache.getStats ? userCache.getStats() : 0,
      resumeCacheSize: resumeCache.getStats ? resumeCache.getStats() : 0,
      templateCacheSize: templateCache.getStats ? templateCache.getStats() : 0
    }
  }, [])

  // Automatic cache cleanup on memory pressure
  useEffect(() => {
    const handleMemoryPressure = () => {
      console.log('Memory pressure detected, clearing old cache entries')
      // Clear non-essential cache entries
      templateCache.clear()
    }

    // Listen for memory pressure events (if supported)
    if ('memory' in performance) {
      // Modern browsers may support this
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries()
        entries.forEach((entry) => {
          if (entry.entryType === 'measure' && entry.name === 'memory-pressure') {
            handleMemoryPressure()
          }
        })
      })
      
      try {
        observer.observe({ entryTypes: ['measure'] })
      } catch (error) {
        // Not supported in this browser
      }

      return () => {
        try {
          observer.disconnect()
        } catch (error) {
          // Ignore cleanup errors
        }
      }
    }
  }, [])

  const contextValue = {
    // Cache instances
    cache,
    apiCache,
    userCache,
    resumeCache,
    templateCache,
    
    // Management functions
    clearUserCache,
    clearResumeCache,
    clearApiCache,
    clearAllCache,
    invalidateResumeCache,
    prefetchResume,
    getCacheStats,
    
    // Utility functions
    memoize: cache.memoize.bind(cache)
  }

  return (
    <CacheContext.Provider value={contextValue}>
      {children}
    </CacheContext.Provider>
  )
}

export default CacheProvider