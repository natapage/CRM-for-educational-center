const BASE = "http://localhost:1337";

export interface Student {
  id: number;
  attributes: {
    name: string;
    date: string;
    phone: string;
    description: string;
    class: {
      data: {
        attributes: {
          name: string;
        };
      };
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface StudentResponse {
  data: Student[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export const getStudentsWithEntities = async (): Promise<StudentResponse> => {
  const response = await fetch(`${BASE}/api/students?populate=*`);
  return await response.json();
};
