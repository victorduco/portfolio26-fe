import { ref } from "vue";

// API URL from environment
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

// Shared state across all component instances
const isAuthenticated = ref(false);
const isLoading = ref(false);
let checkPromise = null;

/**
 * Composable for authentication management
 * Provides reactive auth state and methods to check/update authentication
 */
export function useAuth() {
  /**
   * Check authentication status with backend
   * Results are cached and shared across all component instances
   */
  const checkAuth = async () => {
    // If already checking, return the existing promise
    if (checkPromise) return checkPromise;

    isLoading.value = true;

    checkPromise = (async () => {
      try {
        const response = await fetch(`${API_URL}/api/whoami`, {
          method: "GET",
          credentials: "include",
        });
        const data = await response.json();
        isAuthenticated.value = response.ok && data.ok;
        return isAuthenticated.value;
      } catch (err) {
        isAuthenticated.value = false;
        return false;
      } finally {
        isLoading.value = false;
        checkPromise = null;
      }
    })();

    return checkPromise;
  };

  /**
   * Reset authentication cache
   * Call this after successful login to force a fresh check
   */
  const resetAuthCache = () => {
    checkPromise = null;
  };

  /**
   * Mark user as authenticated without checking backend
   * Useful after successful login
   */
  const setAuthenticated = (value) => {
    isAuthenticated.value = value;
  };

  return {
    isAuthenticated,
    isLoading,
    checkAuth,
    resetAuthCache,
    setAuthenticated,
  };
}
