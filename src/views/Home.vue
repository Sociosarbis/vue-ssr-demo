<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
    <ol>
      <li v-for="news in newsList" :key="news.uniquekey">
        <ul>
          <li>
            {{ news.title }}
            <img v-if="news.thumbnail_pic_s" :src="news.thumbnail_pic_s" />
          </li>
          <li>{{ news.author_name }}</li>
        </ul>
      </li>
    </ol>
  </div>
</template>

<script>
// @ is an alias to /src
import { mapActions, mapState } from "vuex";
import HelloWorld from "@/components/HelloWorld.vue";
import HeadMixin from "@/mixins/head-mixin";

export default {
  name: "home",
  title: "首页",
  metas: [
    {
      key: "name",
      props: {
        name: "description",
        content: "Welcome to Your Vue.js App"
      }
    }
  ],
  mixins: [HeadMixin],
  components: {
    HelloWorld
  },
  computed: {
    ...mapState(["newsList"])
  },
  serverPrefetch() {
    return this.fetchNews();
  },
  mounted() {
    if (!(this.newsList && this.newsList.length)) {
      this.fetchNews();
    }
  },
  methods: {
    ...mapActions(["fetchNews"])
  }
};
</script>
