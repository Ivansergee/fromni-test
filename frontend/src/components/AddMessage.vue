<template>
  <div class="box mb-3">
    <div class="level is-mobile">
      <div class="level-left">
        <div class="level-item">
          <a @click="showContent = !showContent">
            <p class="title is-4 mb-1">
              {{ msngr.name }}
              <i class="bi bi-chevron-down" v-if="!showContent"></i>
              <i class="bi bi-chevron-up" v-else></i>
            </p>
          </a>
        </div>
      </div>
    </div>


    <div v-if="showContent">
      <div class="field">
        <label><b>Порядок</b></label>
        <div class="control">
          <input type="number" min="1" :max="maxOrder" v-model="order">
        </div>
      </div>

      <div class="field" v-if="msngr.max_chars > 0">
        <label><b>Сообщение</b></label>
        <div class="control">
          <textarea class="textarea" cols="100" rows="3" :maxlength="msngr.max_chars" v-model="text"></textarea>
        </div>
        <p class="help">{{ charCount }}/{{ msngr.max_chars }}</p>
      </div>
      <div class="field" v-else>
        <label><b>Сообщение</b></label>
        <div class="control">
          <textarea class="textarea" cols="100" rows="3" v-model="text"></textarea>
        </div>
        <p class="help">{{ charCount }}</p>
      </div>

      <div v-if="msngr.kb_std_enabled || msngr.kb_std_enabled">
        <p ><b>Клавиатура</b></p>
  
        <div class="field">
          <label class="checkbox">
            <input type="checkbox" @click="showKb = !showKb">
            Добавить клавиатуру
          </label>
        </div>
  
        <div v-if="showKb">
          <div class="field mt-2 ">
            <label>Тип клавиатуры</label>
            <div class="control">
              <label class="radio">
                <input type="radio" :name="msngr.name + 'keyboard'" value="std" v-model="kbType">
                Стандартная
              </label>
              <label class="radio">
                <input type="radio" :name="msngr.name + 'keyboard'" value="inline" v-model="kbType">
                Inline
              </label>
            </div>
          </div>
  
          <div v-if="kbType">
            <div v-for="(button, index) in buttons" :key="index">
              <div class="level is-mobile">
                <div class="field">
                  <label>Кнопка {{ index + 1 }}</label>
                  <div class="control"></div>
                  <input class="input" type="text" v-model="buttons[index].text">
                </div>
                <div class="field">
                  <div class="control">
                    <label class="radio">
                      <input type="radio" :name="'button' + index" value="std" v-model="buttons[index].type">
                      Стандартная
                    </label>
                    <label class="radio">
                      <input type="radio" :name="'button' + index" value="link" v-model="buttons[index].type">
                      Ссылка
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <button class="button is-success is-small mb-2" @click="addButton">Ещё одна кнопка</button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
<script>

export default {
  props: ['msngr', 'message', 'index', 'maxOrder'],
  emits: ['update-message'],
  data() {
    return {
      showContent: false,
      showKb: false,
      messengerId: null,
      kbType: null,
      text: '',
      buttons: null,
      order: null
    }
  },
  watch: {
    messengerId(newValue) {
      this.$emit('update-message', { messengerId: newValue, kbType: this.kbType, text: this.text, order: this.order, buttons: this.buttons })
    },
    text(newValue) {
      this.$emit('update-message', { messengerId: this.messengerId, kbType: this.kbType, text: newValue, order: this.order, buttons: this.buttons })
    },
    kbType(newValue) {
      this.$emit('update-message', { messengerId: this.messengerId, kbType: newValue, text: this.text, order: this.order, buttons: this.buttons })
    },
    buttons: {
      handler(newVal, oldVal) {
        this.$emit('update-message', { messengerId: this.messengerId, kbType: this.kbType, text: this.text, order: this.order, buttons: newVal })
      },
      deep: true
    }
  },
  mounted() {
    this.messengerId = this.message.messengerId;
    this.text = this.message.text;
    this.kbType = this.message.kbType;
    this.buttons = this.message.buttons;
    this.order = this.message.order;
  },
  computed: {
    charCount() {
      return this.text.length
    }
  },
  methods: {
    addButton() {
      this.buttons.push({ text: '', type: 'std' })
    }
  },

};
</script>