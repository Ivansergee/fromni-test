<template>
  <div class="level is-mobile mb-2">
    <div class="level-left">
      <a @click="$emit('remove')" class="mr-2">
        <i class="bi bi-x-lg has-text-danger"></i>
      </a>

      <div class="field">
        <label>Кнопка {{ index + 1 }}</label>
        <div class="control">
          <input class="input" type="text" :value="text" @change="updateText">
        </div>
      </div>
    </div>

    <div class="level-right">
      <div class="field">
        <div class="control">
          <label class="radio">
            <input type="radio" :name="'button' + index" value="std" @input="updateType">
            Стандартная
          </label>
          <label class="radio">
            <input type="radio" :name="'button' + index" value="link" @input="updateType">
            Ссылка
          </label>
        </div>
      </div>
    </div>

  </div>
</template>
<script>

export default {
  props: ['index', 'text', 'type', 'messenger'],
  emits: ['update-text', 'update-type', 'remove'],
  methods: {
    updateType(event) {
      this.$emit('update-type', event.target.value)
    },
    updateText(event) {
      this.$emit('update-text', event.target.value)
    },
  },

};
</script>