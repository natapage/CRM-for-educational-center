import { ref, Ref } from "vue";
import { createEntity } from "../API/requestsApi";
import { BASE } from "../constants/constants.ts";

export function useCreateEntity<T>() {
  const isShowModalCreate = ref<boolean>(false);
  const error: Ref<string | null> = ref(null);

  async function createItem(body: T, entity: string) {
    const url = `${BASE}/api/${entity}`;
    try {
      await createEntity<unknown, T>(body, url);
      error.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.log(err);
    }
  }
  return { error, createItem, isShowModalCreate };
}
