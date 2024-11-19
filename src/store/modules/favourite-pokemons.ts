import { mapActions } from 'vuex';

import { Pokemon } from '@/models/pokemon'
import { Query } from '@/models/query';

export default {
  namespaced: true,
  state() {
    return {
      favouritePokemonIdList: [] as Number[]
    };
  },

  getters: {
    ...mapActions('pokemonStore', ['loadPokemonList']),

    // pre: load pokemon id list
    // get pokemon list with query using pokemon module
    async pokemonList(state: any, query: Query ) {
      let pokemonList: Pokemon[] = [];

      try {
        // exact search by pokemon id or name
        if (query.pokemonIdOrName) {
          const pokemon = await this.loadPokemonList(query.pokemonIdOrName);
          if (pokemon != null)
            pokemonList.push(pokemon);
        } 
        
        // filter by gender
        else if (query.pokemonGender) {
          const promises = state.favouritePokemonIdList.map(async (pokemonId: any) => {
            const pokemonIdOrName = pokemonId;
            const pokemon = await this.loadPokemonList(pokemonIdOrName);
            if (pokemon && pokemon.gender == query.pokemonGender)
              return pokemon;
          });
          pokemonList = await Promise.all(promises);
        }
        
        // no query
        else {
          const promises = state.favouritePokemonIdList.map(async (pokemonId: any) => {
            const pokemon = await this.loadPokemonList(pokemonId);
            if (pokemon != null)
              return pokemon;
          });
          pokemonList = await Promise.all(promises);
        }

      } catch (error: any) {
        console.error('Error during load favourite pokemon: ', error);
      } 

      return pokemonList;
    }
  },

  actions: {
    // get pokemon id from backend and add to state
    async loadFavouritePokemonIdList(context: any) {
      try {
        const response = await fetch(
          process.env.FAVOURITE_POKEMON_API_URL, 
          {
            method: 'GET',
            headers: {'Content-Type': 'application/json' },
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message); 
        } 
        const pokemonIdList = JSON.parse(responseData);
    
        context.commit('setFavouritePokemonIdList', pokemonIdList);
      } catch (error) {
        console.error("Error during load favourite pokemon id:", error);
      }      
    },

    // add pokemon id to backend
    async addToFavourite(payload: any) {
      const pokemonId = payload.pokemonId;
      try {
        const response = await fetch(
          process.env.FAVOURITE_POKEMON_API_URL,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pokemonId })
          }
        );
      
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message);
        }
      } catch (error: any) {
        console.error('Error during add favourite Pokémon:', error);
      }
    },

    // remove pokemon id from backend
    async removeFromFavourite(payload: any) {
      const pokemonId = payload.pokemonId;
      
      try {
        const response = await fetch(
          process.env.FAVOURITE_POKEMON_API_URL + `/${pokemonId}`, 
          {
            method: 'DELETE',
            headers: {'Content-Type': 'application/json' },
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message); 
        } 
      } catch (error) {
        console.error("Error during remove favourite pokemon:", error);
      }
    },  
  },

  mutations: {
    // add all pokemon id to state
    setFavouritePokemonIdList(state: { favouritePokemonIdList: any; }, payload: { pokemonIdList: any; }) {
      const pokemonIdList = payload.pokemonIdList;
      state.favouritePokemonIdList = pokemonIdList;
    },
  },
};