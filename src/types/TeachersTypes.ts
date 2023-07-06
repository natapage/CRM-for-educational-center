import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";

export interface TeachersAttributes {
  name: string;
  phone: string;
}

export interface Teacher extends Entity {
  attributes: SharedAttributes & TeacherClassAttributes;
}

export interface TeachersResponse extends EntitiesResponse {
  data: Teacher[];
}

export interface TeachersTask {
  attributes: {
    date: string;
    description: string;
  };
}

export interface TeachersClass {
  attributes: {
    name: string | null;
    description: string;
  };
}

export interface TeacherClassAttributes extends TeachersAttributes {
  classes: {
    data: TeachersClass[];
  };
  tasks: {
    data: TeachersTask[];
  };
}
