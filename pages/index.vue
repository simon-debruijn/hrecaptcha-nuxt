<template>
  <div class="container">
    <form @submit.prevent="onSubmit">
      <label for="email">Email</label>
      <input type="email" name="email" id="email" />
      <label for="agree">Agree</label>
      <input type="checkbox" name="agree" id="agree" />
      <button type="submit">Subscribe</button>
      <small>
        This site is protected by hCaptcha and its
        <a href="https://hcaptcha.com/privacy">Privacy Policy</a> and
        <a href="https://hcaptcha.com/terms">Terms of Service</a> apply.
      </small>
      <vue-hcaptcha
        ref="invisibleHcaptcha"
        :sitekey="hcaptchaKey"
        language="nl"
        data-size="invisible"
        @verify="onVerify"
        @expired="onExpire"
        @challengeExpired="onExpire"
        @error="onError"
      ></vue-hcaptcha>
    </form>
  </div>
</template>

<script>
import VueHcaptcha from '@hcaptcha/vue-hcaptcha'

export default {
  components: { VueHcaptcha },
  data() {
    return {
      verified: false,
      token: null,
      key: null,
      hcaptchaSuccess: false,
    }
  },
  methods: {
    async onVerify(token, key) {
      this.verified = true
      this.token = token
      this.key = key

      const response = await fetch('hcaptcha/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, key }),
      })

      const { success } = await response.json()

      this.hcaptchaSuccess = success

      if (success) {
        alert("You're good to go")
      }
    },
    onExpire() {
      this.verified = false
      this.token = null
      this.key = null
      this.expired = true
      console.log('Expired')
    },
    onError(err) {
      this.token = null
      this.key = null
      this.error = err
      console.log(`Error: ${err}`)
    },
    onSubmit() {
      if (this.hcaptchaSuccess) {
        console.log('you can sumbit')
      }
    },
  },
  computed: {
    hcaptchaKey() {
      return `${this.$config.hcaptchaClientKey}`
    },
  },
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

form {
  display: flex;
  flex-direction: column;
  text-align: left;
  justify-content: flex-start;
}

form > * {
  margin-bottom: 0.5rem;
}
</style>
