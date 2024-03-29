import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";
import { Class } from "./ClassesTypes";

export interface Student extends Entity {
  attributes: SharedAttributes & StudentAttributes;
}
export interface StudentAttributes {
  name: string;
  date: string;
  phone: string;
  description: string;
  class?: {
    data: Class;
  };
}

export interface StudentsResponse extends EntitiesResponse {
  data: Student[];
}

export type RowType = {
  id: number;
  name: string;
  date: Date;
  phone: number;
  class: string;
  description: string;
};
