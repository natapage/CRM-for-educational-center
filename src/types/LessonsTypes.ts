import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";
import { Class } from "./ClassesTypes";

export interface LessonsAttributes {
  name: "string";
  description: "string";
  duration: "number";
  class?: {
    data: Class;
  };
}

export interface Lesson extends Entity {
  attributes: SharedAttributes & LessonsAttributes;
}

export interface LessonsResponse extends EntitiesResponse {
  data: Lesson[];
}
