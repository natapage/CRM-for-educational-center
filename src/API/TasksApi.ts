import { BASE } from "../constants.ts/constаnts.ts";
import { TasksResponse } from "../types/TasksTypes.ts";

export const getTasksWithEntities = async (): Promise<TasksResponse> => {
  try {
    const response = await fetch(`${BASE}/api/tasks?populate=*`);
    if (!response.ok) {
      throw new Error("Failed to fetch tasks with entities");
    }
    return await response.json();
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "unknown error");
  }
};
