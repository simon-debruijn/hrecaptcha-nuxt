<template>
  <div class="container">
    <form @submit.prevent="onSubmit">
      <label for="email">Email</label>
      <input type="email" name="email" id="email" />
      <label for="agree">Agree</label>
      <input type="checkbox" name="agree" id="agree" />
      <vue-hcaptcha
        ref="invisibleHcaptcha"
        :sitekey="hcaptchaKey"
        size="invisible"
        theme="dark"
        @verify="onVerify"
        @expired="onExpire"
        @challengeExpired="onExpire"
        @error="onError"
      />
      <button type="submit">Subscribe</button>
      <small>
        This site is protected by hCaptcha and its
        <a href="https://hcaptcha.com/privacy">Privacy Policy</a> and
        <a href="https://hcaptcha.com/terms">Terms of Service</a> apply.
      </small>
    </form>
  </div>
</template>

<script>
import VueHcaptcha from '@hcaptcha/vue-hcaptcha';

export default {
  components: { VueHcaptcha },
  methods: {
    onVerify(token, ekey) {
      this.verified = true;
      this.token = token;
      this.eKey = ekey;
      console.log(`Callback token: ${token}, ekey: ${ekey}`);
    },
    onExpire() {
      this.verified = false;
      this.token = null;
      this.eKey = null;
      this.expired = true;
      console.log('Expired');
    },
    onError(err) {
      this.token = null;
      this.eKey = null;
      this.error = err;
      console.log(`Error: ${err}`);
    },
    onSubmit() {
      console.log(
        'Submitting the invisible hCaptcha',
        this.$refs.invisibleHcaptcha
      );
      this.$refs.invisibleHcaptcha.execute();
    },
  },
  computed: {
    hcaptchaKey() {
      return `${this.$config.hcaptchaClientKey}`;
    },
  },
};
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
