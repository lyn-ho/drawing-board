<template lang="pug">
  div#app {{ message }}
</template>

<script>
export default {
  data() {
    return {
      message: 'test test',
    };
  },
};
</script>

<style lang="less">
#app {
  font-size: 18px;
  font-family: 'Roboto', sans-serif;
  color: blue;
}
</style>
