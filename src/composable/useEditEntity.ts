import { ref, Ref } from "vue";
import { editEntity } from "../API/requestsApi";
import { BASE } from "../constants.ts/constаnts.ts";

export function useEditEntity<T>(entity: string) {
  const error: Ref<string | null> = ref(null);
  const data: Ref<T | null> = ref(null);

  async function editItem<M extends T, N>(body: N) {
    const url = `${BASE}/api/${entity}`;
    try {
      const response = await editEntity<M, N>(body, url);
      data.value = response;
      error.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.log(err);
    }
  }
  return { error, editItem, data };
}
