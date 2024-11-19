<template>
    <div class="home">
      <HelloWorld msg="Welcome to Your Vue.js App"/>
    </div>
  </template>
  
  <script>
  // @ is an alias to /src
  
  // get list of pokemons with pagination, search, filter, sort
  // navigate to pokemon details page when click on the pokemon
  // •	A favourite icon to mark pokemon as favourite
  // •	A "Favourite" menu or button navigate to favourite page
  
  
  import HelloWorld from '@/components/HelloWorld.vue'
  
  export default {
    name: 'HomeView',
    components: {
      HelloWorld
    }
  }
</script>
this.$store.dispatch('favourite-pokemon/addToFavourite', { pokemonId: this.id })
this.$store.dispatch('favourite-pokemon/removeFromFavourite', { pokemonId: pokemonId });
this.$store.getters['pokemon/pokemon']({ pokemonId: id });