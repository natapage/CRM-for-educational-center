import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";
import { Teacher } from "./TeachersTypes";

export interface ClassesAttributes {
  name: "string";
  description: "string";
}

export interface Class extends Entity {
  attributes: SharedAttributes &
    ClassesAttributes & { teacher: { data: Teacher } };
}

export interface ClassesResponse extends EntitiesResponse {
  data: Class[];
}
