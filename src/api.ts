const BASE = "http://localhost:1337";

export interface Entitie {
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

export interface EntitiesResponse {
  data: Entitie[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface classesResponse {}

export const getStudentsWithEntities = async (): Promise<EntitiesResponse> => {
  const response = await fetch(`${BASE}/api/students?populate=*`);
  return await response.json();
};

export const getClassesWithEntities = async (): Promise<EntitiesResponse> => {
  const response = await fetch(`${BASE}/api/classes?populate=*`);
  return await response.json();
};

export const createClass = async (body: {}) =>
  (
    await fetch(`${BASE}/api/classes`, {
      method: "POST",
      body: JSON.stringify({ data: body }),
      headers: {
        "Content-type": "application/json",
      },
    })
  ).json();

export const deleteClass = async (id: number) =>
  (await fetch(`${BASE}/api/classes/${id}`, { method: "DELETE" })).json();
