import { createStore } from 'vuex';

import pokemons from './modules/pokemons';

const store = createStore({
  modules: {
    pokemon: pokemons
  },
});

export default store;