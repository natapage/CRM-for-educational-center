import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";

interface ClassesAttributes {
  name: "string";
  description: "string";
}

export interface Class extends Entity {
  attributes: SharedAttributes & ClassesAttributes;
}

export interface ClassesResponse extends EntitiesResponse {
  data: Class[];
}
