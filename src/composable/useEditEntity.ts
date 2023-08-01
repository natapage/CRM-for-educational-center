import { ref, Ref } from "vue";
import { editEntity } from "../API/requestsApi";
import { BASE } from "../constants/constants.ts";

export function useEditEntity<R, T>(entity: string) {
  const error: Ref<string | null> = ref(null);
  const data: Ref<R | null> = ref(null);

  async function editItem(body: T) {
    const url = `${BASE}/api/${entity}`;
    try {
      const response = await editEntity<R, T>(body, url);
      data.value = response;
      error.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.log(err);
    }
  }
  return { error, editItem, data };
}
