import { BASE } from "../constаnts.ts";
import { ClassesResponse } from "../types/ClassesTypes.ts";

export const getClassesWithEntities = async (): Promise<ClassesResponse> => {
  try {
    const response = await fetch(`${BASE}/api/classes?populate=*`);
    if (!response.ok) {
      throw new Error("Failed to fetch classes with entities");
    }
    return await response.json();
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "unknown error");
  }
};

export const createClass = async (body: {}): Promise<ClassesResponse> => {
  try {
    const response = await fetch(`${BASE}/api/classes`, {
      method: "POST",
      body: JSON.stringify({ data: body }),
      headers: {
        "Content-type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to create class");
    }

    return response.json();
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "unknown error");
  }
};

export const deleteClass = async (id: number): Promise<ClassesResponse> => {
  try {
    const response = await fetch(`${BASE}/api/classes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete class");
    }

    return response.json();
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "unknown error");
  }
};
