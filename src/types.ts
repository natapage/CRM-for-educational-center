export interface Entitie {
  id: number;
  attributes: {
    name: string;
    date: string;
    phone: string;
    description: string;
    class: {
      data: {
        attributes: {
          name: string;
        };
      };
    };
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
  };
}

export interface EntitiesResponse {
  data: Entitie[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}