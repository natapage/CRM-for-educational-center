import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";
import { Teacher } from "./TeachersTypes";

export interface TasksAttributes {
  description: string;
  date: string;
  teacher: {
    data: Teacher;
  };
}

export interface Task extends Entity {
  attributes: SharedAttributes & TasksAttributes;
}

export interface TasksResponse extends EntitiesResponse {
  data: Task[];
}

