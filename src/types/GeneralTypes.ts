export interface Entity {
  id: number;
  attributes: {
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}
export interface EntitiesResponse {
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

export interface SharedAttributes {
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}
