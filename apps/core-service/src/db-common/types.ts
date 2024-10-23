/**
 * @fileoverview Common types for the database related code.
 */

/**
 * Represents a paginated list of items.
 */
export type Paginated<T> = {
  items: T[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
  };
};

/**
 * Represents the parameters for pagination.
 */
export type PaginationParams = {
  limit: number;
  offset: number;
};
