export interface PaginationQuery {
  page?: number;
  limit?: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}

export function paginate<T>(
  data: T[],
  total: number,
  query: PaginationQuery,
): PaginatedResult<T> {
  const page = query.page || 1;
  const limit = query.limit || 10;
  const totalPages = Math.ceil(total / limit);

  return {
    data,
    meta: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
}

export function paginateQuery(query: PaginationQuery): {
  skip: number;
  take: number;
} {
  const page = query.page || 1;
  const limit = query.limit || 10;

  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}