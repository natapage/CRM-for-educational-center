import { BASE } from "../constants.ts/constаnts.ts";
import { getEntity } from "../API/requestsApi.ts";
import { Ref, ref } from "vue";

export function useFetchPage<T>(entity: string) {
  const url: string = `${BASE}/api/${entity}?populate=*`;
  const entities: Ref<T[]> = ref([]);
  const error: Ref<Error | null> = ref(null);
  const showSpinner = ref<boolean>(true);

  async function fetchPage() {
    try {
      const data = await getEntity<T>(url);
      entities.value = data;
    } catch (err) {
      error.value = err;
    } finally {
      showSpinner.value = false;
    }
  }

  fetchPage();

  return { entities, error, showSpinner, fetchPage };
}
