<template>
  <div class="home">
    <b-container v-if="loading">
      <b-card>
        <b-skeleton animation="wave" width="85%"></b-skeleton>
        <b-skeleton animation="wave" width="55%"></b-skeleton>
        <b-skeleton animation="wave" width="70%"></b-skeleton>
      </b-card>
    </b-container>
    <b-container v-else>
      <b-button-group>
        <b-button @click="Next(-1)" v-if="meta && meta.currentPage !==1">Previous</b-button>
        {{ meta.currentPage }} / {{ meta.totalPages }} ( {{ meta.totalItems }})
        <b-button @click="Next(1)" v-if="meta && meta.totalPages !== meta.currentPage">Next</b-button>
      </b-button-group>
      <b-card v-for="item in items" :key="item.id" @click="View(item)">
        <b-card-img img-top
                    tag="article"
                    style="max-width: 20rem;"
                    class="mb-2" :src="item.imageData" ></b-card-img>
        <b-card-body>
          <b-card-text>
            {{ JSON.parse(item.jsonResult).text }}
          </b-card-text>
        </b-card-body>
      </b-card>

    </b-container>
  </div>
</template>

<script setup>
  import { ref, onMounted } from "vue"
  import { useRouter } from "vue-router"
  import config from '../../config'

  const router = useRouter()
  const loading = ref(true)
  const userMessage = ref("")
  const meta = ref({
    totalItems: 0,
    itemCount: 0,
    itemsPerPage: 0,
    totalPages: 0,
    currentPage: 0,
  })
  const items = ref([])

  const View = item => {
    router.push(`/view/${item.id}`)
  }

  const Next = async i => {
    if (meta && meta.currentPage + i >= 0 && meta.currentPage + i <= meta.totalPages)
      await ListWrapper(meta.currentPage + i);
  }

  const ListWrapper = async i => {
    loading.value = true;
  
    try {
      const result = await List(i, 25);
      meta.value = result.meta;
      item.value = result.items;

      console.log(result);
    } catch (e) {
      loading.value = false;
      userMessage.value = e.message;
    }
    // loading.value = false;
  }

  const List = async (page, limit) => {
    const result = await (fetch(`${ config.SERVER_URL }/api/upload/list`, {
      method: "POST",
      body: JSON.stringify({
        limit: limit,
        page: page
  
      })
    }));
    if (result.ok)
      return await result.json();
  }

  onMounted(async () => {
    await ListWrapper(1);
  })
  </script>
  