import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";
import { Teacher } from "./TeachersTypes";

export interface ClassesAttributes {
  name: "string";
  description: "string";
  teacher?: {
    data: Teacher;
  };
}

export interface Class extends Entity {
  attributes: SharedAttributes & ClassesAttributes;
}

export interface ClassesResponse extends EntitiesResponse {
  data: Class[];
}
