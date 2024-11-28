import { ActionTree, ActionContext } from 'vuex';
import axios from 'axios';
import { Query } from '@/models/query';
import { Pokemon } from '@/models/pokemon'

const GET_POKEMON_API_URL='https://pokeapi.co/api/v2/pokemon'
const GET_POKEMON_ABILITIES_API_URL='https://pokeapi.co/api/v2/ability'

export default {
  namespaced: true,
  state() {
    return {
      favouritePokemonIdList: [] as Number[],
      pokemonList: [] as Pokemon[],
      query: {
        pokemonIdOrName: '',
    orderBy: '',
    pageNumber: '',
    pageSize: '',
    pokemonGender: '',
    isMyFavourite: ''
      }
    };
  },
  
  // pre: load pokemon list
  getters: {
    async getPokemonList({ commit, dispatch, getters, state }: ActionContext<any, any>) {
      if (state.pokemonList == null)
        await dispatch('loadPokemonList')
      
      return state.pokemonList
    },
  },

  actions: {
    // get pokemon id from backend and add to state
    async loadFavouritePokemonIdList({ commit, dispatch, getters, state }: ActionContext<any, any>) {
      const storedList = localStorage.getItem('favouritePokemonIdList');
      commit('setFavouritePokemonIdList', storedList ? JSON.parse(storedList) : []);     
    },

    // pre: loadFavouritePokemonList
    // get pokemon list with pagination, sorting, filtering, search from api and set state
    async loadPokemonList({ commit, dispatch, getters, state }: ActionContext<any, any>, payload: { query: Query }) {
      if (state.favouritePokemonIdList == null || state.favouritePokemonIdList.length == 0)
        await dispatch('loadFavouritePokemonIdList')

      const { query } = payload;

      let queryString = '';

      // exact search, single result
      if (query?.pokemonIdOrName && query.pokemonIdOrName != null)
        queryString += `/${query.pokemonIdOrName}`
      
      // multiple results
      else {
        queryString += '?';

        // todo
        // if (query.orderBy)
        //   queryString += `orderBy=id ${query.orderBy}&`
        if (query?.pageNumber && query.pageNumber != null)
          queryString += `offset=${query.pageNumber}&`;
        if (query?.pageSize && query.pageSize != null)
          queryString += `limit=${query.pageSize}&`;
        // if (query.pokemonGender)
        //   queryString += `gender=${query.pokemonGender}&`;

        queryString = queryString.slice(0, -1); // remove last '&'
      }
      
      try {
        const response = await fetch(
          GET_POKEMON_API_URL + queryString, 
          {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Accept-Language, Accept-Encoding',
             },
          }
        );
        
        const responseData = await response.json();

        if (!response.ok) {
          throw new Error(responseData.message); 
        } 

        const promises = responseData.results.map(async (result: any) => {
          const pokemon = await dispatch('loadBasicPokemonInfo', { url: result.url });
          return pokemon;
        });
        
        let pokemonList = [];
        
        if (query?.isMyFavourite)
          pokemonList = (await Promise.all(promises)).filter(pokemon => pokemon.favouritePokemonId != -1);
        else  
          pokemonList = (await Promise.all(promises)).filter(pokemon => pokemon != null);

        commit('setPokemonList', pokemonList);
        commit('setQuery', query);

        return pokemonList;
      } catch (error) {
        console.error("Error during load pokemon:", error);
      }
    },

    // pre: loadFavouritePokemonIdList
    // get pokemon list with pagination, sorting, filtering, search from api and set state
    async loadFavouritePokemonList({ commit, dispatch, getters, state }: ActionContext<any, any>) {
      if (state.favouritePokemonIdList == null || state.favouritePokemonIdList.length == 0)
        await dispatch('loadFavouritePokemonIdList')

      try {
        const promises = state.favouritePokemonIdList.map(async (pokemonId: Number) => {
          if (pokemonId != null) {
            const pokemon = await dispatch('loadBasicPokemonInfo', { url: GET_POKEMON_API_URL + '/' + pokemonId });
            return pokemon;
          }
          
        });
        
        const pokemonList = ((await Promise.all(promises)).filter(p => p!=null))
        
        commit('setPokemonList', pokemonList);
        
        return pokemonList;
      } catch (error) {
        console.error("Error during load pokemon:", error);
      }
    },

    // pre: loadFavouritePokemonList
    // get pokemon basic info
    async loadBasicPokemonInfo({ commit, dispatch, getters, state }: ActionContext<any, any>, payload: { url: any }) {
      if (state.favouritePokemonIdList == null)
        await dispatch('loadFavouritePokemonIdList')
      
      const { url } = payload;

      try {
        const response = await fetch(
          url, 
          {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Accept-Language, Accept-Encoding',
             },
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
          gender: responseData.sprites.back_female?.length == 0 ? 'Male' : 'Female',
          favouritePokemonId: state.favouritePokemonIdList.indexOf(responseData.id)
        };
      
        return pokemon;

      } catch (error) {
        console.error("Error during load pokemon details:", error);
      }
    },

    // pre: loadFavouritePokemonList
    // get pokemon details by id from api
    async loadPokemonDetails({ commit, dispatch, getters, state }: ActionContext<any, any>, payload: { pokemonId: number }) {
      if (state.favouritePokemonIdList == null)
        await dispatch('loadFavouritePokemonIdList')

      const { pokemonId } = payload;

      try {
        const response = await fetch(
          GET_POKEMON_API_URL + `/${pokemonId}`, 
          {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Accept-Language, Accept-Encoding',
             },
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
          gender: responseData.sprites.back_female?.length == 0 ? 'Male' : 'Female',
          favouritePokemonId: state.favouritePokemonIdList.indexOf(responseData.id),

          height: responseData.height,
          weight: responseData.weight,
          abilities: [],
          types: [],
        };

        // abilities
        responseData.abilities.map((ability: any) => {
          pokemon.abilities?.push(ability.ability.name)
        });

        // types
        responseData.types.map((type: any) => {
          pokemon.types?.push(type.type.name)
        });

        // stats details
        responseData.stats.map((stat: any) => {
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
        return null;
      }
    },

    async loadAbilityDescription({ commit, dispatch, getters, state }: ActionContext<any, any>, payload: { abilityName: any }) {
      const { abilityName } = payload;

      try {
        const response = await fetch(
          GET_POKEMON_ABILITIES_API_URL + `/${abilityName}`, 
          {
            method: 'GET',
            headers: {'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Accept, Accept-Language, Accept-Encoding',
             },
          }
        );
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message); 
        } 

        const effect = responseData.effect_entries.find(
          (effect: any) => effect.language.name === 'en'
        );
        const description = effect ? effect.effect : '';

        return description;

      } catch (error) {
        console.error("Error during load ability description:", error);
      }
    },

    // add/remove pokemon id to backend
    async toggleFavourite({ commit, dispatch, getters, state }: ActionContext<any, any>, payload: { pokemonId: number }) {
      const { pokemonId } = payload;
      
        let dataToSend;

        if (state.favouritePokemonIdList.indexOf(pokemonId) == -1) {
          // add to favourite
          dataToSend = [...state.favouritePokemonIdList, pokemonId];
        } else {
          // remove from favourite
          dataToSend =  state.favouritePokemonIdList.filter((p: Number) => p != pokemonId)
        }
        localStorage.setItem('favouritePokemonIdList', JSON.stringify(dataToSend));    
        await dispatch('loadFavouritePokemonIdList');

        await commit('toggleFavouritePokemon', pokemonId)
    },

    async sharePage({ commit, dispatch, getters, state }: ActionContext<any, any>, payload: { pokemonId: string }) {
      const { pokemonId } = payload;
      if (navigator.share) {
        try {
          await navigator.share({
            title: document.title,
            text: 'Check out this pokemon!',
            url: window.location.hostname + "/pokemons/" + pokemonId,
          });
        } catch (error) {
          console.error('Error sharing:', error);
        }
      } else {
        alert('Web Share API is not supported in your browser.');
      }
    }
  },

  mutations: {
    setPokemonList(state: { pokemonList: any; quantity: any; }, pokemonList: any) {
      state.pokemonList = [...pokemonList];
    },

    // add all pokemon id to state
    setFavouritePokemonIdList(state: { favouritePokemonIdList: any; }, pokemonIdList: any) {
      state.favouritePokemonIdList = [...pokemonIdList];
    },

    setQuery(state: { query: Query; }, query: Query) {
      state.query = query
    },

    toggleFavouritePokemon(state: { favouritePokemonIdList: any; pokemonList: any[]; }, pokemonId: any) {
      const favouritePokemonIdList = state.favouritePokemonIdList;
          
      const pokemonList = state.pokemonList.map((pokemon: any) => {
        if (favouritePokemonIdList.includes(pokemon.id)) {
          pokemon.favouritePokemonId = pokemon.id;
        } else {
          pokemon.favouritePokemonId = -1;
        }
        return pokemon;
      });

      state.pokemonList = [...pokemonList]
    }
  },
};
