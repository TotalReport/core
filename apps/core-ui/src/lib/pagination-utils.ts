
export function totalPagesCount(totalItems: number, pageSize: number): number {
  return totalItems == 0 ? 1 : Math.ceil(totalItems / pageSize);
}