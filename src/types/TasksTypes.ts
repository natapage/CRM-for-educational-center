import { SharedAttributes, EntitiesResponse, Entity } from "./GeneralTypes";

export interface TasksAttributes {
  description: string;
  date: string;
}

export interface Task extends Entity {
  attributes: SharedAttributes & TaskTeacherAttributes;
}

export interface TasksResponse extends EntitiesResponse {
  data: Task[];
}

export interface TaskTeacher {
  attributes: {
    name: string | null;
  };
}
export interface TaskTeacherAttributes extends TasksAttributes {
  teacher: {
    data: TaskTeacher;
  };
}
