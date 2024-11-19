import { createRouter, createWebHashHistory } from 'vue-router'

import PokemonListView from '../views/pokemon/PokemonListView.vue'
import PokemonDetailsView from '../views/pokemon/PokemonDetailsView.vue'
import FavouritePokemonView from '../views/pokemon/FavouritePokemonView.vue'

const routes = [
  {
    path: '/',
    component: PokemonListView
  },
  {
    path: '/pokemons/:id',
    component: PokemonDetailsView,
  },
  {
    path: '/favourite-pokemons',
    component: FavouritePokemonView,
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
