<template>
  <b-container>
    <UserMessages :error="error" :user-message="userMessage" />
    <b-card v-if="loading">
      <b-skeleton animation="wave" width="85%"></b-skeleton>
      <b-skeleton animation="wave" width="55%"></b-skeleton>
      <b-skeleton animation="wave" width="70%"></b-skeleton>
    </b-card>
    <b-row v-else>
      <b-col cols="12">
        <b-form>
          <b-form-group label="Processor Id">
            <b-form-input v-model="pId"></b-form-input>
          </b-form-group>
          <b-form-group
            label="Drag and drop or select a file. It will be auto processed. You must put in an Processor Id to enable this input.">
            <input type="file" placeholder="Choose a file or drop it here..." drop-placeholder="Drag and drop a file" @input="FileSelected"
                         :disabled="hasId()" />
          </b-form-group>

        </b-form>
      </b-col>
    </b-row>
  </b-container>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Upload } from "./upload.api"
import UserMessages from './UserMessages.vue';

const router = useRouter();
const pId = ref("40d6bffe6cfd02cf");
const error = ref(false);
const userMessage = ref("");
const loading = ref(false);
const file = ref(null);

const hasId = () => {
  return pId.value.trim().length === 0;
}

const FileSelected = async (file) => {
  loading.value = true;
  const reader = new FileReader();
  reader.readAsDataURL(file.target.files[0]);
  reader.onload = async () => {
    let resp;
    try {
      resp = await Upload(reader.result, pId.value);
    } catch (e) {
      error.value = true;
      userMessage.value = e.message;
      loading.value= false;
      return;
    }
    if (resp && resp.id) {
      await router.push(`/view/${resp.id}`);
      loading.value= false;
      return;
    }
    console.log("Could not read file");
    error.value = true;
    userMessage.value = "Server could not get file";
    loading.value= false;
  };
}
</script>