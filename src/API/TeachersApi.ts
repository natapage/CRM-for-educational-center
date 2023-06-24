import { BASE } from "../constants.ts/constаnts.ts";
import { TeachersResponse } from "../types/TeachersTypes.ts";

export const getTeachersWithEntities = async (): Promise<TeachersResponse> => {
  try {
    const response = await fetch(`${BASE}/api/teachers?populate=*`);

    if (!response.ok) {
      throw new Error("Failed to fetch teachers with entities");
    }

    return await response.json();
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "unknown error");
  }
};

export const deleteTeacher = async (id: number): Promise<TeachersResponse> => {
  try {
    const response = await fetch(`${BASE}/api/teachers/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete teacher");
    }

    return response.json();
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "unknown error");
  }
};
