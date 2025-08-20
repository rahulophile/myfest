// Utility to help with rate limiting issues during development
import { buildApiUrl } from '../config/config';

export const resetRateLimits = async () => {
  try {
    const response = await fetch(buildApiUrl('/api/dev/reset-rate-limits'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Rate limiting reset:', data.message);
      return { success: true, message: data.message };
    } else {
      console.error('❌ Failed to reset rate limiting:', response.status);
      return { success: false, message: 'Failed to reset rate limiting' };
    }
  } catch (error) {
    console.error('❌ Error resetting rate limiting:', error);
    return { success: false, message: 'Network error while resetting rate limiting' };
  }
};

export const handleRateLimitError = (error, retryFunction, maxRetries = 3) => {
  if (error.status === 429) {
    console.log('⚠️ Rate limited, will retry automatically...');
    
    // Exponential backoff retry
    let retryCount = 0;
    const retry = () => {
      if (retryCount < maxRetries) {
        retryCount++;
        const delay = Math.pow(2, retryCount) * 1000; // 2s, 4s, 8s
        console.log(`🔄 Retrying in ${delay/1000} seconds... (attempt ${retryCount}/${maxRetries})`);
        
        setTimeout(() => {
          retryFunction();
        }, delay);
      } else {
        console.error('❌ Max retries reached for rate limited request');
      }
    };
    
    retry();
    return true; // Indicates rate limiting was handled
  }
  
  return false; // Indicates rate limiting was not handled
}; 