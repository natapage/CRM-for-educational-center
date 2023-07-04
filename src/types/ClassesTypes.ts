import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";
// import { Teacher } from "./TeachersTypes";

export interface ClassesAttributes {
  name: "string";
  description: "string";
}

export interface Class extends Entity {
  attributes: SharedAttributes & ClassTeacherAtributes;
}

export interface ClassesResponse extends EntitiesResponse {
  data: Class[];
}

export interface ClassTeacher {
  attributes: {
    name: string | null;
  };
}

export interface ClassTeacherAtributes extends ClassesAttributes {
  teacher: {
    data: ClassTeacher;
  };
}
