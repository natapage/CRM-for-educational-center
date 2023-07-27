import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";
import { Teacher } from "./TeachersTypes";
import { Slot } from "./SlotsTypes";
import { Student } from "./StudentsTypes";

export interface ClassesAttributes {
  name: "string";
  description: "string";
  student?: {
    data: Student;
  };
  teacher?: {
    data: Teacher;
  };
  slots?: {
    data: Slot;
  };
}

export interface Class extends Entity {
  attributes: SharedAttributes & ClassesAttributes;
}

export interface ClassesResponse extends EntitiesResponse {
  data: Class[];
}
