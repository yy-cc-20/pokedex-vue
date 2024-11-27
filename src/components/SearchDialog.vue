<template>
  <teleport to="body">
    <div @click="cancelSearch" class="backdrop"></div>
    <transition name="dialog">
      <dialog open>
        <form @submit.prevent="submitForm">

          <div class="form-control">
            <label for="pokemonIdOrName">Pokemon Id or Name</label>
            <input
              type="text"
              name="pokemonIdOrName"
              v-model.trim="pokemonIdOrName"
            />
          </div>

          <div class="form-control">
            <label for="pokemonGender">Pokemon Gender</label>
            <select v-model="pokemonGender" name="pokemonGender">
              <option value="">Male and Female</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div class="form-control">
            <label>Order By</label>

            <div>
              <input type="radio" id="asc" name="orderBy" value="asc" v-model=orderBy checked>
              <label for="asc">Pokemon Id 
                <v-icon
                  icon="mdi-arrow-down"
                ></v-icon>
              </label><br>

              <input type="radio" id="desc" name="orderBy" value="desc" v-model=orderBy>
              <label for="desc">Pokemon Id 
                <v-icon
                  icon="mdi-arrow-up"
                ></v-icon>
              </label><br>
            </div>
          </div>
          
          <base-button>Search</base-button>
        </form>
      </dialog>
    </transition>
  </teleport>
</template>

<script>
export default {
  emits: ['cancel-search', 'apply-search'],
  data() {
    return {
      pokemonIdOrName: '',
      orderBy: '',
      pokemonGender: '',
    };
  },
  methods: {
    submitForm() {
      const query = {
        pokemonIdOrName: this.pokemonIdOrName,
        orderBy: this.orderBy,
        pokemonGender: this.pokemonGender
      };

      this.$emit('apply-search', query);
    },
    cancelSearch() {
      this.$emit('cancel-search');
    },
  },
};
</script>
  
  <style scoped>
  .backdrop {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.75);
    z-index: 10;
  }
  
  dialog {
    position: fixed;
    top: 20vh;
    left: 10%;
    width: 80%;
    z-index: 100;
    border-radius: 12px;
    border: none;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.26);
    padding: 0;
    margin: 0;
    overflow: hidden;
    background-color: white;
  }
  
  header {
    background-color: #3a0061;
    color: white;
    width: 100%;
    padding: 1rem;
  }
  
  header h2 {
    margin: 0;
  }
  
  section {
    padding: 1rem;
  }
  
  menu {
    padding: 1rem;
    display: flex;
    justify-content: flex-end;
    margin: 0;
  }
  
  .dialog-enter-from,
  .dialog-leave-to {
    opacity: 0;
    transform: scale(0.8);
  }
  
  .dialog-enter-active {
    transition: all 0.3s ease-out;
  }
  
  .dialog-leave-active {
    transition: all 0.3s ease-in;
  }
  
  .dialog-enter-to,
  .dialog-leave-from {
    opacity: 1;
    transform: scale(1);
  }
  
  @media (min-width: 768px) {
    dialog {
      left: calc(50% - 20rem);
      width: 40rem;
    }
  }
  </style>