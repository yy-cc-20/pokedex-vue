export interface Pokemon {
  id: number;
  picture: string
  name: string;
  gender: string;

  // details
  types?: string[]
  height?: number
  weight?: number
  abilities?: string[]

  // stats details
  hp?: string
  attack?: string
  defense?: string
  special?: string
  specialAttack?: string
  specialDefense?: string
  speed?: string  
}
