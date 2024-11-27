<template>
  <router-link :to="{ name: 'PokemonDetailsView', params: { id: parseInt(this.id) - 1 } }">{{ '<' }} Previous  </router-link>
  <router-link :to="{ name: 'PokemonDetailsView', params: { id: parseInt(this.id) + 1 } }">Next ></router-link><br/>

  <v-sheet v-if="pokemon==null">
    Pokemon not found
  </v-sheet>

  <v-sheet v-if="pokemon!=null">
    
    <img :src="pokemon.picture" /><br/>
    
    Id: {{ pokemon.id }} <br/>
    Name: {{ pokemon.name }} <br/>
    Gender: {{ pokemon.gender }} <br/>
    <div v-if="pokemon.types && pokemon.types.length">
      Types: {{ pokemon.types.join(', ') }}
    </div>
    Height: {{ pokemon.height }} <br/>
    Weight: {{ pokemon.weight }} <br/>
    Ability: 
    
      <a 
        v-for="ability in pokemon.abilities"
        :key="ability"
        >
        <a @click="toggleShow(ability)">
          {{ ability }}
        </a>
        <v-expand-transition>
          <div v-show="show.indexOf(ability) != -1">
            <v-divider></v-divider>
            {{ loadAbilityDescription(ability) }}
          </div>
        </v-expand-transition>
        <br/>
      </a>
    <br/>
          
    <strong>Stats</strong><br/>
    HP: {{ pokemon.hp }}<br/>
    Attack: {{ pokemon.attack }}<br/>
    Defense: {{ pokemon.defense }}<br/>
    Special: {{ pokemon.special }}<br/>
    Special Attack: {{ pokemon.specialAttack }}<br/>
    Special Defense: {{ pokemon.specialDefense }}<br/>
    Speed: {{ pokemon.speed }}

  </v-sheet>
        
</template>

<script>
export default {
  props: {
    id: {
      required: true,
    },
  },
  data() {
    return {
      isLoading: true,
      pokemon: {},
      show: []
    };
  },
  created() {
    this.loadPokemonDetails();
  },
  watch: {
    id: {
      immediate: true,
      handler() {
        this.loadPokemonDetails();
      }
    }
  },
  methods: {
    async loadPokemonDetails() {
      this.isLoading = true;
      try {
        this.pokemon = await this.$store.dispatch('pokemon/loadPokemonDetails', { pokemonId: parseInt(this.id) })
      } catch(err) {
        this.pokemon = null
      }
      
      this.isLoading = false
    },
    async toggleFavouritePokemon() {
      await this.$store.dispatch('pokemon/toggleFavourite', { pokemonId: this.pokemon.id }); 
      await this.loadPokemonDetails()
      console.log(this.pokemon)
    },
    async loadAbilityDescription(abilityName) {
      return this.$store.dispatch('pokemon/loadAbilityDescription', { abilityName: abilityName});
    },
    toggleShow(name) {
      if (this.show.includes(name)) {
        this.show = this.show.filter(item => item !== name);
      } else {
        this.show.push(name);
      }
    },
    share() {
      this.$store.dispatch('pokemon/sharePage', { pokemonId: this.pokemon.id }); 
    }
  },
  computed: {
    isVisible(name) {
      return this.show.indexOf(name) != -1
    },
  },  
}
</script>
