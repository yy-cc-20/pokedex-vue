import { createStore } from 'vuex';

import favouritePokemons from './modules/favourite-pokemons';
import pokemons from './modules/pokemons';

const store = createStore({
  modules: {
    favouritePokemonStore: favouritePokemons,
    pokemonStore: pokemons
  },
});

export default store;