<template>
  <div class="transfer-wrap">
    这是转账页面
    {{inputParams}}
    <button @click="onProcess">processMsg</button>
  </div>
</template>

<script>
// import QOSRpc from 'js-for-qos-httprpc'
import { processMsg } from '../../common/bgcontact'

export default {
  data () {
    return {}
  },
  computed: {
    inputParams () {
      return JSON.stringify(this.$store.getters.firstMsg)
    }
  },
  mounted () {
    this.getAccount()
  },
  methods: {
    onProcess () {
      processMsg()
    },
    getAccount () {
      // Promise((resolve, reject) => {
      //   const rpc = new QOSRpc({ baseUrl: 'http://192.168.1.37:9876' })
      //   try {
      //     const account = rpc.newAccount(
      //       'fury flavor subway start spare hospital tag chief word start pencil borrow town mandate detect pencil cook bridge right scout remain this differ leader'
      //     )
      //     console.log(account)
      //     resolve()
      //   } catch (error) {
      //     console.log(error)
      //   }
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
@import "~style/common.scss";
.transfer-wrap {
  @include common-container;

}
</style>
