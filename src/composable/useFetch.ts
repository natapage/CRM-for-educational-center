import { getEntity } from "../API/requestsApi.ts";
import { Ref, ref } from "vue";

export function useFetch<T>(entity: string) {
  const url: string = `${
    import.meta.env.VITE_API_BASE_URL
  }/api/${entity}?populate=*`;
  const data: Ref<T | null> = ref(null);
  const error: Ref<string | null> = ref(null);
  const showSpinner = ref<boolean>(true);

  async function fetch() {
    try {
      const response = await getEntity<T>(url);
      data.value = response;
      error.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
    } finally {
      showSpinner.value = false;
    }
  }

  return { data, error, showSpinner, refetch: fetch };
}
