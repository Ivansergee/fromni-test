<template>
  <div class="box mb-3" v-if="messenger">
    <div class="level is-mobile">
      <div class="level-left">
        <div class="level-item">
          <a @click="showContent = !showContent">
            <p class="title is-4 mb-1">
              {{ messenger.name }}
              <i class="bi bi-chevron-down" v-if="!showContent"></i>
              <i class="bi bi-chevron-up" v-else></i>
            </p>
          </a>
        </div>
      </div>
      <div class="level-right">
        <p class="title is-4">
          <a @click="$emit('remove', message.messengerId)">
            <i class="bi bi-x-lg has-text-danger"></i>
          </a>
        </p>
      </div>
    </div>


    <div v-if="showContent">

      <div class="field">
        <label><b>Порядок отправки</b></label>
        <div class="control">
          <input type="number" min="1" :max="maxOrder" v-model="message.order">
        </div>
      </div>

      <div class="field">
        <label><b>Сообщение</b></label>
        <div class="control">
          <textarea class="textarea" cols="100" rows="3" v-model="message.text"></textarea>
        </div>
        <p class="help" v-if="messenger.max_chars != 0">{{ charCount }} / {{ messenger.max_chars }}</p>
        <p class="help" v-else>{{ charCount }}</p>
      </div>

      <div v-if="messenger.kb_std_enabled || messenger.kb_inline_enabled">
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
                <input type="radio"
                :name="'keyboard' + message.messengerId"
                value="std"
                :disabled="!messenger.kb_std_enabled"
                v-model="message.kbType">
                Стандартная
              </label>
              <label class="radio">
                <input type="radio"
                :name="'keyboard' + message.messengerId"
                value="inline"
                :disabled="!messenger.kb_inline_enabled"
                v-model="message.kbType">
                Inline
              </label>
            </div>
          </div>
  
          <div v-if="message.kbType">
            <div v-for="(button, index) in message.buttons" :key="index">
              <KbButton 
              :text="button.text"
              :type="button.type"
              :index="index"
              :messenger="messenger"
              @update-text="updateButtonText(index, $event)"
              @update-type="updateButtonType(index, $event)"
              @remove="removeButton(index)"
              />
            </div>
            <button
              class="button is-success is-small mb-2"
              @click="addButton"
            >Добавить кнопку</button>
          </div>
        </div>

      </div>

    </div>
  </div>
</template>
<script>
import KbButton from './KbButton.vue';

export default {
  props: ['message', 'maxOrder', 'messenger'],
  emits: ['update-message', 'remove'],
  components: {
    KbButton
  },
  data() {
    return {
      showContent: false,
      showKb: false,
    }
  },
  computed: {
    charCount() {
      return this.message.text.length
    },
  },
  methods: {
    addButton() {
      this.message.buttons.push({ text: '', type: '' })
    },
    updateButtonType(index, value) {
      this.message.buttons[index].type = value
    },
    updateButtonText(index, value) {
      this.message.buttons[index].text = value
    },
    removeButton(index) {
      this.message.buttons.splice(index, 1);
    }
  },

};
</script>