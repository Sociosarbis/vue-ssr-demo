<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
<script>
import HeadMixin from "@/mixins/head-mixin";
export default {
  title: "关于",
  metas: [
    {
      key: "name",
      props: {
        name: "description",
        content: "This is an about page"
      }
    }
  ],
  mixins: [HeadMixin]
};
</script>
>
