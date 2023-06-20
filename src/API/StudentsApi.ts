import { BASE } from "../constsnts";
import { StudentsResponse } from "../types/StudentsTypes";

export const getStudentsWithEntities = async (): Promise<StudentsResponse> => {
  const response = await fetch(`${BASE}/api/students?populate=*`);
  return await response.json();
};
