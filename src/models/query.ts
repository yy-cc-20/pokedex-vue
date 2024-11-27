export interface Query {
    pokemonIdOrName?: string,
    orderBy?: string,
    pageNumber?: number,
    pageSize?: number,
    pokemonGender?: string
    isMyFavourite: boolean
}

export const MAX_PAGE_SIZE = 50;
export const MIN_PAGE_SIZE = 15;