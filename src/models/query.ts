export interface Query {
    pokemonIdOrName?: string,
    orderBy?: string,
    pageNumber?: string,
    pageSize?: string,
    pokemonGender?: string
}

export const MAX_PAGE_SIZE = 50;
export const MIN_PAGE_SIZE = 15;