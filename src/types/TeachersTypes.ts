import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";

export interface TeachersAttributes {
  name: string;
  phone: string;
}

export interface Teacher extends Entity {
  attributes: SharedAttributes & TeacherClassAtributes;
}

export interface TeachersResponse extends EntitiesResponse {
  data: Teacher[];
}

interface TeacherClassAtributes extends TeachersAttributes {
  class: {
    data: {
      attributes: {
        name: string | null;
      };
    };
  };
  task: {
    data: {
      attributes: {
        description: string | null;
        date: string;
      };
    };
  };
}
