import { ref, Ref } from "vue";
import { deleteEntity } from "../API/requestsApi";
import { BASE } from "../constants/constants.ts";

export function useDeleteEntity<T>(entity: string) {
  const isShowModalConfirm = ref<boolean>(false);
  const classIdToDelete = ref<number>();
  const error: Ref<string | null> = ref(null);

  function handleConfirmation(id: number): void {
    isShowModalConfirm.value = true;
    classIdToDelete.value = id;
  }

  async function deleteItem() {
    const idToDelete = classIdToDelete.value;
    const url = `${BASE}/api/${entity}/${idToDelete}`;
    try {
      await deleteEntity<T>(url);
      error.value = null;
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Unknown error";
      console.log(err);
    }
  }

  return {
    error,
    deleteItem,
    handleConfirmation,
    isShowModalConfirm,
  };
}
