<template>
  <b-row v-if="message && message.length > 0">
    <b-col cols="4" offset="4">
      <b-alert show variant="danger" v-if="error" fade>{{ message }}</b-alert>
      <b-alert show variant="success" v-else fade>{{ message }}</b-alert>
    </b-col>
  </b-row>

</template>
<script setup>
import { defineProps } from 'vue'

defineProps({
  error: Boolean,
  message: String
})

</script>
