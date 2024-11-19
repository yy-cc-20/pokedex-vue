import { Query } from '@/models/query';
import { Pokemon } from '@/models/pokemon'

export default {
  namespaced: true,
  state() {
    return {
      pokemonList: [] as Pokemon[],
      quantity: Number
    };
  },
  
  // pre: load pokemon list
  getters: {
    pokemonList(state: { pokemonList: any; }) {
      return state.pokemonList;
    },
    quantity(state: { quantity: any; }) {
      return state.quantity;
    }
  },
  
  actions: {
    // get pokemon list with pagination, sorting, filtering, search from api and set state
    async loadPokemonList(context: any, query: Query) {
      let queryString = '';
      const defaultOrderBy = "asc";
      let pokemonList = [];

      // exact search, single result
      if (query.pokemonIdOrName)
        queryString += `/${query.pokemonIdOrName}`
      
      // multiple results
      else {
        queryString += `?orderBy=id ${query.orderBy || defaultOrderBy}&`

        if (query.pageNumber)
          queryString += `pageNumber=${query.pageNumber}&`;
        if (query.pageSize)
          queryString += `pageSize=${query.pageSize}&`;
        if (query.pokemonGender)
          queryString += `gender=${query.pokemonGender}&`;

        queryString = queryString.slice(0, -1); // remove last '&'
      }
      
      try {
        const response = await fetch(
          process.env.GET_POKEMON_API_URL + queryString, 
          {
            method: 'GET',
            headers: {'Content-Type': 'application/json' },
          }
        );
        
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message); 
        } 

        const promises = responseData.results.array.forEach(async (result: any) => {
          const pokemon = await this.loadPokemon(result.url)
          if (pokemon != null)
            pokemonList.push(pokemon);  
        });
      
        pokemonList = await Promise.all(promises);

        context.commit('setPokemonList', pokemonList);
        context.commit('setPokemonQuantity', responseData.count);

      } catch (error) {
        console.error("Error during load pokemon:", error);
      }
    },

    // get pokemon basic info
    async loadPokemon(url: any) {
      try {
        const response = await fetch(
          url, 
          {
            method: 'GET',
            headers: {'Content-Type': 'application/json' },
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message); 
        } 

        const pokemon: Pokemon = {
          id: responseData.id,
          picture: responseData.sprites.other.dream_world.front_default,
          name: responseData.name,
          gender: responseData.gender,
        };
      
        return pokemon;

      } catch (error) {
        console.error("Error during load pokemon details:", error);
      }
    },

    // get pokemon details by id from api
    async loadPokemonDetails(pokemonId: any) {
      try {
        const response = await fetch(
          process.env.GET_POKEMON_API_URL + `/${pokemonId}`, 
          {
            method: 'GET',
            headers: {'Content-Type': 'application/json' },
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message); 
        } 

        const pokemon: Pokemon = {
          id: responseData.id,
          picture: responseData.sprites.other.dream_world.front_default,
          name: responseData.name,
          gender: responseData.gender,

          height: responseData.height,
          weight: responseData.weight,
        };

        // abilities
        responseData.abilities.array.forEach((ability: any) => {
          pokemon.abilities?.push(ability.abilitiy.name)
        });

        // types
        responseData.types.array.forEach((type: any) => {
          pokemon.types?.push(type.type.name)
        });

        // stats details
        responseData.stats.array.forEach((stat: any) => {
          switch (stat.stat.name) {
            case 'hp': 
              pokemon.hp = stat.base_stat
              break;

            case 'attack': 
              pokemon.attack = stat.base_stat
              break;

            case 'defense':
              pokemon.defense = stat.base_stat
              break;

            case 'special-attack':
              pokemon.specialAttack = stat.base_stat
              break;

            case 'special-defense':
              pokemon.specialDefense = stat.base_stat
              break;
            
            case 'speed':
              pokemon.speed = stat.base_stat
              break;

            case 'special':
              pokemon.special = stat.base_stat
              break;
          }  
        });
      
        return pokemon;

      } catch (error) {
        console.error("Error during load pokemon details:", error);
      }
    },

    async loadAbilityDescription(abilityName: any) {
      let description = "";
      
      try {
        const response = await fetch(
          process.env.GET_POKEMON_ABILITIES_API_URL + `/${abilityName}`, 
          {
            method: 'GET',
            headers: {'Content-Type': 'application/json' },
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message); 
        } 

        responseData.effect_entries.array.forEach((effect: any) => {
          switch (effect.language.name) {
            case 'en': 
              description = effect.effect;
              break;
          }
        });

        return description;

      } catch (error) {
        console.error("Error during load pokemon details:", error);
      }
    }
  },

  mutations: {
    setPokemonList(state: { pokemonList: any; quantity: any; }, payload: { pokemonList: any; count: any; }) {
      state.pokemonList = payload.pokemonList;
      state.quantity = payload.count;
    }
  },
};
