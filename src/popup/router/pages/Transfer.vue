<template>
  <div class="transfer-wrap">
    这是转账页面
    {{inputParams}}
  </div>
</template>

<script>

export default {
  data () {
    return {

    }
  },
  computed: {
    inputParams () {
      return this.$store.state.toPage
    }
  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped>
@import "~style/common.scss";

</style>
