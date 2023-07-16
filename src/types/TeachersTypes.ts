import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";
import {Class} from "../types/ClassesTypes"
import { Task } from "./TasksTypes";


export interface TeachersAttributes {
  name: string;
  phone: string;
  classes: {
    data: Class[];
  };
  tasks: {
    data: Task[];
  };
}

export interface Teacher extends Entity {
  attributes: SharedAttributes & TeachersAttributes;
}

export interface TeachersResponse extends EntitiesResponse {
  data: Teacher[];
}

