const BASE = "http://localhost:1337";

import { EntitiesResponse } from "./types";

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
