import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";
import { Class } from "./ClassesTypes";
import { Lesson } from "./LessonsTypes";

export interface SlotsAttributes {
  class?: {
    data: Class;
  };
  lesson?: {
    data: Lesson;
  };
  order: "string";
  dayofweek: "string";
}

export interface Slot extends Entity {
  attributes: SharedAttributes & SlotsAttributes;
}

export interface SlotsResponse extends EntitiesResponse {
  data: Slot[];
}
