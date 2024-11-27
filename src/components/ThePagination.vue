<template>
  <div class="text-center" v-show="!isLoading">
    <v-container>
      <v-row justify="center">
        <v-col cols="8">
          <v-container>
            <v-pagination
              @click="goTo(page)"
              v-model="page"
              :length="4"
              class="my-4"
            ></v-pagination>
          </v-container>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
export default {
  props: {
    currentPageNumber: {
      required: true
    },
    isLoading: {
      required: true
    }
  },
  emit: ['go-to-page'],
  data() {
    return {
      page: this.currentPageNumber
    };
  },
  methods: {
    goTo(page) {
      this.$emit('go-to-page', page);
    }
  },  
}
</script>
  