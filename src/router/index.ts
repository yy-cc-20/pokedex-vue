import { createRouter, createWebHashHistory } from 'vue-router'

import PokemonListView from '../views/pokemon/PokemonListView.vue'
import PokemonDetailsView from '../views/pokemon/PokemonDetailsView.vue'
import FavouritePokemonList from '@/views/pokemon/FavouritePokemonList.vue'

const routes = [
  {
    path: '/',
    component: PokemonListView,
    name: 'PokemonListView'
  },
  {
    path: '/favourite-pokemons',
    component: FavouritePokemonList,
    name: 'FavouritePokemonList'
  },
  {
    path: '/pokemons/:id',
    component: PokemonDetailsView,
    props: true,
    name: 'PokemonDetailsView'
  },
  { 
    path: '/:notFound(.*)', 
    redirect:  '/'
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
