import { ref } from "vue";
import { deleteEntity } from "../API/requestsApi";
import { BASE } from "../constants.ts/constаnts.ts";

export function useDeleteEntity<T>(entity: string) {
  const showModalConfirm = ref<boolean>(false);
  const classIdToDelete = ref<number>();

  function useConfirmation(id: number) {
    showModalConfirm.value = true;
    classIdToDelete.value = id;
  }

  async function useDelete() {
    const idToDelete = classIdToDelete.value as number;
    const url = `${BASE}/api/${entity}/${idToDelete}`;
    try {
      await deleteEntity<T>(url);
    } catch (err) {
      console.log(err);
    }
  }

  return {
    useConfirmation,
    useDelete,
    showModalConfirm,
  };
}
