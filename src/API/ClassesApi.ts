import { BASE } from "../constsnts";
import { ClassesResponse, Class } from "../types/ClassesTypes";

export const getClassesWithEntities = async (): Promise<ClassesResponse> => {
  try {
    const response = await fetch(`${BASE}/api/classes?populate=*`);
    if (!response.ok) {
      throw new Error("Failed to fetch classes with entities");
    }
    return await response.json();
  } catch (error) {
    console.error(error);
  }
};

export const createClass = async (body: {}): Promise<any> => {
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
  } catch (error) {
    console.error(error);
  }
};

export const deleteClass = async (id: number): Promise<any> => {
  try {
    const response = await fetch(`${BASE}/api/classes/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete class");
    }

    return response.json();
  } catch (error) {
    console.error(error);
  }
};
