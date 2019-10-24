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
      return JSON.stringify(this.$store.state.toPage.params)
    }
  },
  mounted () {

  }
}
</script>

<style lang="scss" scoped>
@import "~style/common.scss";

</style>
