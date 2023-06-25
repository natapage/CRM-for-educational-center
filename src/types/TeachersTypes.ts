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

interface TeachersTask {
  attributes: {
    date: string;
    description: string;
  };
}

interface TeacherClassAtributes extends TeachersAttributes {
  class: {
    data: {
      attributes: {
        name: string | null;
      };
    };
  };
  tasks: {
    data: TeachersTask[];
  };
}
