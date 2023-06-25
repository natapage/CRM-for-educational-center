import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";

export interface TasksAttributes {
  description: "string";
  date?: string;
}

export interface Task extends Entity {
  attributes: SharedAttributes & TasksAttributes;
}

export interface TasksResponse extends EntitiesResponse {
  data: Task[];
}
