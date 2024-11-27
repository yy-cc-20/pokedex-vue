<template>
  <div>
    <v-spacer></v-spacer>
    <button @click="openSearchDialog">Search</button>
  </div>
  <PokemonItemGroup :pokemonList=pokemonList :isLoading=isLoading></PokemonItemGroup>
  <ThePagination :isLoading=isLoading :currentPageNumber="pageNumber"></ThePagination>
  <SearchDialog v-if="!isLoading && showSearchDialog"></SearchDialog>
</template>

<script>
import PokemonItemGroup from '@/components/PokemonItemGroup.vue';
import ThePagination from '@/components/ThePagination.vue';
const SearchDialog = () => import('@/components/SearchDialog.vue');
import { MIN_PAGE_SIZE } from '@/models/query';

export default {
  components: {
    PokemonItemGroup,
    ThePagination,
    SearchDialog
  },
  data() {
    return {
      pokemonList: [],
      isLoading: false,
        pokemonIdOrName: '',
        orderBy: '',
        pokemonGender: '',

        isMyFavourite: false,
        pageNumber: 0,
        pageSize: MIN_PAGE_SIZE,
        showSearchDialog: false,
    };
  },
  created() {
    this.loadPokemonList();
  },
  methods: {
    async loadPokemonList() {
      this.isLoading = true;
      this.isMyFavourite = await window.location.pathname == '/favourite-pokemons';
      const query = {
        pokemonIdOrName: this.pokemonIdOrName,
        orderBy: this.orderBy,
        pokemonGender: this.pokemonGender,
        isMyFavourite: this.isMyFavourite,
        pageNumber: this.pageNumber,
        pageSize: this.pageSize,
      }
      this.pokemonList = await this.$store.dispatch('pokemon/loadPokemonList', { query: query});
      this.isLoading = false;
    },
    async goToPage(page) {
      this.isLoading = true;
      this.pageNumber = page;
      this.loadPokemonList();    
      this.isLoading = false;
    },
    openSearchDialog() {
      this.showSearchDialog = true;
    },
    cancelSearch() {
      this.showSearchDialog = false;
    },
    applySearch(query) {
      this.showSearchDialog = false;
      this.isLoading = true;
      
      this.pokemonIdOrName = query.pokemonIdOrName;
      this.orderBy = query.orderBy;
      this.pokemonGender = query.pokemonGender;

      this.loadPokemonList();    
      this.isLoading = false;
    }
  },
};
</script>
