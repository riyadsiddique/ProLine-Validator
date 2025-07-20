import { productionConfig } from '../config/production';

export const debounce = <F extends (...args: any[]) => any>(
  func: F,
  waitFor: number
) => {
  let timeout: ReturnType<typeof setTimeout>;

  return (...args: Parameters<F>): Promise<ReturnType<F>> => {
    clearTimeout(timeout);
    return new Promise((resolve) => {
      timeout = setTimeout(() => resolve(func(...args)), waitFor);
    });
  };
};

export const memoize = <T extends (...args: any[]) => any>(
  func: T,
  resolver?: (...args: Parameters<T>) => any
): T => {
  const cache = new Map();

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = resolver ? resolver(...args) : JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = func(...args);
    cache.set(key, result);
    return result;
  }) as T;
};

export const measurePerformance = async (
  operation: () => Promise<any>,
  operationName: string
) => {
  if (productionConfig.ENVIRONMENT !== 'production') {
    const start = performance.now();
    try {
      return await operation();
    } finally {
      const end = performance.now();
      console.log(`${operationName} took ${end - start}ms`);
    }
  }
  return operation();
};
