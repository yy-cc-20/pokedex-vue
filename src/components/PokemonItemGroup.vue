<template>
  <v-container fluid>
    <v-progress-circular
      v-if="isLoading"
      indeterminate
      color="primary"
    ></v-progress-circular>

    <v-row dense>
      <v-col
        v-for="pokemon in pokemonList"
        :key="pokemon.id"
        cols="12"
        sm="6"
        md="4"
      >
      
        <PokemonItem :pokemon="pokemon"/>
      
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import PokemonItem from './PokemonItem.vue';

export default {
  components: {
    PokemonItem
  },
  props: {
    isLoading: {
      type: Boolean,
      required: true,
    },
    pokemonList: {
      required: true,
    },
  },
};
</script>