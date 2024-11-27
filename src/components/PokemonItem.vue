<template>
  <v-card
    class="mx-auto"
    max-width="344"
    >

    <v-img
      height="200px"
      :src="pokemon.picture"
      cover
    ></v-img>

    <router-link :to="{ name: 'PokemonDetailsView', params: { id: pokemon.id } }">
      <v-card-title>
      #{{ pokemon.id }} {{ pokemon.name }}
    </v-card-title>
    
    </router-link>
    
    <v-card-subtitle>
      {{ pokemon.gender }}
    </v-card-subtitle>

    <v-card-actions>
      <v-spacer></v-spacer>
      <button @click="toggleFavourite">{{ pokemon.favouritePokemonId == -1 ? "Like" : "Liked" }}</button>
    </v-card-actions>
  </v-card>
</template>

<script>

export default {
  props: {
    pokemon: {
      required: true,
    },
  },
  methods: {
    async toggleFavourite() {
      await this.$store.dispatch('pokemon/toggleFavourite', { pokemonId: this.pokemon.id }); 
    },
    share() {
      this.$store.dispatch('pokemon/sharePage', { pokemonId: this.pokemon.id }); 
    }
  },
};
</script>