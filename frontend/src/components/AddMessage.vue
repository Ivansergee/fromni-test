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
      <div class="level-right">
        <div class="level-item">
          <a class="is-size-3" @click="moveUp(msngr.id)"> <i class="bi bi-chevron-up"></i> </a>
          <a class="is-size-3" @click="moveDown(msngr.id)"> <i class="bi bi-chevron-down"></i> </a>
        </div>
      </div>
    </div>


    <div v-if="showContent">
      <div class="field">
        <label><b>Сообщение</b></label>
        <div class="control">
          <textarea class="textarea" cols="100" rows="3" v-model="message"></textarea>
        </div>
      </div>

      <p><b>Клавиатура</b></p>

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
</template>

<script>
import axios from 'axios';

export default {
  props: ['msngr', 'campId', 'msngrsLen', 'submit'],
  emits: ['move-up', 'move-down', 'submited'],
  data() {
    return {
      showContent: false,
      showKb: false,
      kbType: null,
      message: null,
      buttons: [{
        text: '',
        type: 'std'
      }]
    }
  },
  watch: {
    submit(value) {
      if (value) {
        this.createMessage()
      }
    }
  },
  methods: {
    addButton() {
      this.buttons.push({ text: '', type: 'std' })
    },

    moveUp(id){
      this.$emit('move-up', id);
    },
    
    moveDown(id){
      this.$emit('move-down', id);
    },

    createMessage() {
      const msgPayload = {
        campId: this.campId,
        msngrId: this.msngr.id,
        text: this.message,
        kbType: this.kbType,
        order: this.msngr.order
      };

      axios
        .post('messages/', msgPayload)
        .then((res) => {
          const buttonsPayload = {
            msgId: res.data.id,
            buttons: this.buttons,
          };
          axios
            .post('buttons/', buttonsPayload)
            .then(() => {
              this.showContent = false;
              this.$emit('submited', {messengerId: this.msngr.id, status: true})
            })
            .catch((error) => {
              console.log(error);
              this.$emit('submited', {messengerId: this.msngr.id, status: false})
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  },

};
</script>