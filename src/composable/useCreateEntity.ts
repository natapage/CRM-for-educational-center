import { ref } from "vue";
import { createEntity } from "../API/requestsApi";
import { BASE } from "../constants.ts/constаnts.ts";

export function useCreateEntity() {
  const showModalCreate = ref<boolean>(false);

  async function useCreate<T, N>(body: N, entity: string) {
    const url = `${BASE}/api/${entity}`;
    try {
      await createEntity<T, N>(body, url);
    } catch (err) {
      console.log(err);
    }
  }
  return { useCreate, showModalCreate };
}
