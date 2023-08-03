import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";
import { Class } from "../types/ClassesTypes";
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
  photo?: {
    data: Photo;
  };
}

export interface Teacher extends Entity {
  attributes: SharedAttributes & TeachersAttributes;
}

export interface TeachersResponse extends EntitiesResponse {
  data: Teacher[];
}

export interface Photo {
  id: string;
  attributes: {
    name: string;
    formats: {
      thumbnail: {
        name: string;
        url: string;
      };
      small: {
        name: string;
        url: string;
      };
    };
    url: string;
  };
}

export type RowType = {
  id: number;
  photo: string;
  name: string;
  phone: number;
  description: string;
  tasks: {}[];
};
