import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";

export interface Student extends Entity {
  attributes: SharedAttributes & StudentClassAtributes;
}
export interface StudentAttributes {
  name: string;
  date: string;
  phone: string;
  description: string;
}

export interface StudentsResponse extends EntitiesResponse {
  data: Student[];
}

export interface StudentClassAtributes extends StudentAttributes {
  class: {
    data: {
      attributes: {
        name: string | null;
      };
    };
  };
}
