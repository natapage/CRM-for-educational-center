import { ref, Ref } from "vue";
import { createEntity } from "../API/requestsApi";
import { BASE } from "../constants.ts/constаnts.ts";

export function useCreateEntity() {
  const isShowModalCreate = ref<boolean>(false);
  const error: Ref<string | null> = ref(null);

  async function createItem<T, N>(body: N, entity: string) {
    const url = `${BASE}/api/${entity}`;
    try {
      await createEntity<T, N>(body, url);
      error.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.log(err);
    }
  }
  return { error, createItem, isShowModalCreate };
}
