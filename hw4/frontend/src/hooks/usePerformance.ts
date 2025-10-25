import { useState, useEffect, useCallback } from 'react';

interface PerformanceMetrics {
  loadTime: number;
  renderTime: number;
  memoryUsage?: number;
  isSlowConnection: boolean;
}

export const usePerformance = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    loadTime: 0,
    renderTime: 0,
    isSlowConnection: false,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const startTime = performance.now();

    // Check connection speed
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    const isSlowConnection = connection && (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g');

    // Measure memory usage if available
    const memoryUsage = (performance as any).memory ? (performance as any).memory.usedJSHeapSize : undefined;

    const measurePerformance = () => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;

      setMetrics({
        loadTime,
        renderTime: performance.now() - startTime,
        memoryUsage,
        isSlowConnection: !!isSlowConnection,
      });

      setIsLoading(false);
    };

    // Use requestIdleCallback if available, otherwise setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(measurePerformance);
    } else {
      setTimeout(measurePerformance, 0);
    }
  }, []);

  const optimizeForSlowConnection = useCallback(() => {
    if (metrics.isSlowConnection) {
      // Disable animations for slow connections
      document.documentElement.style.setProperty('--animation-duration', '0ms');
      document.documentElement.style.setProperty('--transition-duration', '0ms');
    }
  }, [metrics.isSlowConnection]);

  const preloadImage = useCallback((src: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = reject;
      img.src = src;
    });
  }, []);

  const preloadImages = useCallback(async (srcs: string[]) => {
    const promises = srcs.map(src => preloadImage(src));
    await Promise.allSettled(promises);
  }, [preloadImage]);

  return {
    metrics,
    isLoading,
    optimizeForSlowConnection,
    preloadImage,
    preloadImages,
  };
};

export default usePerformance;



