import { BASE } from "../constаnts";
import { StudentsResponse } from "../types/StudentsTypes";

export const getStudentsWithEntities = async (): Promise<StudentsResponse> => {
  try {
    const response = await fetch(`${BASE}/api/students?populate=*`);

    if (!response.ok) {
      throw new Error("Failed to fetch students with entities");
    }

    return await response.json();
  } catch (error: unknown) {
    throw new Error(error instanceof Error ? error.message : "unknown error");
  }
};

// const s = getStudentsWithEntities()

// const students: Awaited<ReturnType<typeof getStudentsWithEntities>>

// () => Promise<any>

// Promise<any>

// Parameters

// omit

// Pick

// type Student = {
//   id: string,
//   name: string,
//   age: number,
//   createdAt: Date
// }

// Array<Student> Student[]

// type CreateStudentDTO = Omit<Student, 'id' | 'createdAt'>

// const newStudentData: CreateStudentDTO = {age: 2, name: ""}

// type UpdateStudentDTO = Partial<CreateStudentDTO>

// const updatedStudentData: UpdateStudentDTO = { name: "", age: 1}
