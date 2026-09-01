// funcion para obtener todos los registros de una consulta paginada
const PAGE_SIZE = 1000;

export async function fetchAllPaginated<T>(
  queryPage: (from: number, to: number) => Promise<T[]>
): Promise<T[]> {
  let allRows: T[] = [];
  let from = 0;

  while (true) {
    const to = from + PAGE_SIZE - 1;
    const page = await queryPage(from, to);
    if (!page || page.length === 0) break;

    allRows = allRows.concat(page);
    if (page.length < PAGE_SIZE) break;
    from += PAGE_SIZE;
  }

  return allRows;
}