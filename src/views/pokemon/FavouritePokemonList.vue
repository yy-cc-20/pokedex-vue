<template>
    <div>
      <h1>My Favourites</h1>
    </div>
    <PokemonItemGroup :pokemonList=pokemonList :isLoading=isLoading></PokemonItemGroup>
  </template>
  
  <script>
  import PokemonItemGroup from '@/components/PokemonItemGroup.vue';
  
  export default {
    components: {
      PokemonItemGroup,
    },
    data() {
      return {
        pokemonList: [],
        isLoading: false,
      };
    },
    created() {
      this.loadPokemonList();
    },
    methods: {
      async loadPokemonList() {
        this.isLoading = true;
        this.pokemonList = await this.$store.dispatch('pokemon/loadFavouritePokemonList');
        this.isLoading = false;
      },
      async goToPage(page) {
        this.isLoading = true;
        this.pageNumber = page;
        this.loadPokemonList();    
        this.isLoading = false;
      },
    },
  };
  </script>
  