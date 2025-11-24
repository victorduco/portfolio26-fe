import { ref } from "vue";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const isAuthenticated = ref(false);
const isLoading = ref(false);
let checkPromise = null;

export function useAuth() {
  const checkAuth = async () => {
    if (checkPromise) return checkPromise;
    isLoading.value = true;
    checkPromise = fetch(`${API_URL}/api/whoami`, { credentials: "include" })
      .then(async (res) => {
        const data = await res.json();
        isAuthenticated.value = res.ok && data.ok;
        return isAuthenticated.value;
      })
      .catch(() => (isAuthenticated.value = false))
      .finally(() => { isLoading.value = false; checkPromise = null; });
    return checkPromise;
  };

  return {
    isAuthenticated,
    isLoading,
    checkAuth,
    resetAuthCache: () => { checkPromise = null; },
    setAuthenticated: (v) => { isAuthenticated.value = v; },
  };
}
