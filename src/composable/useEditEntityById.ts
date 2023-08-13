import { ref, Ref } from "vue";
import { editEntity } from "../API/requestsApi";

export function useEditEntityById<R, T>(entity: string) {
  const error: Ref<string | null> = ref(null);
  const data: Ref<R | null> = ref(null);

  async function editItemById(id: number, body: T) {
    const url = `${import.meta.env.VITE_API_BASE_URL}/api/${entity}/${id}`;
    try {
      const response = await editEntity<R, T>(body, url);
      data.value = response;
      error.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.log(err);
    }
  }
  return { error, editItemById, data };
}
