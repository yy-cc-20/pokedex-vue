<template>
    <nav>
        <router-link :to="{ name: 'PokemonListView'}" >Pokemon Wiki</router-link><br/>
        <router-link :to="{ name: 'FavouritePokemonList'}">Favourite Pokemon</router-link>
    </nav>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

</style>
  