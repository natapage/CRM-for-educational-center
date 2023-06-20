import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";

interface StudentAttributes {
  name: string;
  date: string;
  phone: string;
  description: string;
}
export interface Student extends Entity {
  attributes: SharedAttributes & StudentClassAtributes;
}

export interface StudentsResponse extends EntitiesResponse {
  data: Student[];
}

interface StudentClassAtributes extends StudentAttributes {
  class: {
    data: {
      attributes: {
        name: string | null;
      };
    };
  };
}
