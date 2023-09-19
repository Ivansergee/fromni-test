<template>
  <div class="modal" :class="{ 'is-active': showModal }">
    <div class="modal-background"></div>
    <div class="modal-content">
      <div class="box">
        <div class="level is-mobile">
          <div class="level-left">
            <p class="title is-4">Создание кампании</p>
          </div>
          <div class="level-right">
            <button class="delete is-medium" aria-label="close" @click="$emit('close')"></button>
          </div>
        </div>

        <div class="field">
          <label>Название</label>
          <div class="control">
            <input type="text" class="input" v-model="campName">
          </div>
        </div>

        <AddMessage v-for="(message, index) in messages" :key="index" :message="message"
          :maxOrder="selectedMessengers.length"
          :messenger="selectedMessengers.find(msngr => msngr.id === message.messengerId)"
          @update-message="updateMessage(index, $event)" @remove="removeMessage(index)" />

        <div class="level" v-if="messengersList.length > 0">
          <div class="level-left">
            <div class="level-item">
              <div class="field">
                <div class="control">
                  <div class="select">
                    <select v-model="selectedMsngr">
                      <option v-for="msngr in messengersList" :key="msngr.id" :value="msngr.id">{{ msngr.name }}</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <div class="level-item">
              <button class="button is-success is-small" @click="addMessenger">Добавить канал</button>
            </div>
          </div>
        </div>

        <div class="field">
          <div class="control">
            <button class="button is-dark" @click="sendForm">Сохранить</button>
          </div>
        </div>

        <div class="notification is-danger" v-if="errors.length > 0">
          <div v-for="error in errors">
            <b v-if="error.messenger">{{ error.messenger }} > {{ error.field }}: </b>
            <span>{{ error.error }}</span>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AddMessage from './AddMessage.vue';
import { validateMessages } from '../../validators.js';

export default {
  props: ['showModal', 'messengers'],
  emits: ['close', 'submited'],
  components: {
    AddMessage
  },
  data() {
    return {
      campName: null,
      messengersList: [],
      selectedMsngr: null,
      selectedMessengers: [],
      messages: [],
      errors: []
    }
  },
  created() {
    for (const msngr of this.messengers) {
      this.messengersList.push(msngr);
    }
  },

  methods: {
    toggleContent(e) {
      const link = e.target;
      const container = link.parentNode.parentNode;
      const content = container.querySelector('.fields-wrapper');
      content.classList.toggle('is-hidden');
    },
    showKb(e) {
      const chb = e.target;
      const container = chb.parentNode.parentNode.parentNode;
      const KbSettings = container.querySelector('.kb-settings');
      KbSettings.classList.toggle('is-hidden');
    },
    addMessenger() {
      const index = this.messengersList.findIndex(obj => obj.id === this.selectedMsngr);
      const order = this.selectedMessengers.length + 1;
      const msngrObj = this.messengersList.splice(index, 1)[0];
      this.selectedMessengers.push(msngrObj);
      this.messages.push({ messengerId: this.selectedMsngr, kbType: '', text: '', order: order, buttons: [] });
    },

    removeMessage(id) {
      const index = this.selectedMessengers.findIndex(obj => obj.id === id);
      this.messengersList.push(this.selectedMessengers.splice(index, 1)[0]);
      const msgIndex = this.messages.findIndex(msg => msg.messengerId === id);
      this.messages.splice(msgIndex, 1)
    },

    updateMessage(index, newMsg) {
      this.messages[index] = newMsg;
    },

    sendForm() {
      const errors = validateMessages(this.messages, this.messengers);
      this.errors = [];
      if (!this.campName) {
        errors.push({ messenger: 'Кампания', field: 'Название', error: 'Название компании не указано' })
      }
      if (errors.length > 0) {
        this.errors = errors;
      }
      else {
        const payload = {
          name: this.campName,
          messages: this.messages
        }

        axios
          .post('/campaigns', payload)
          .then(() => {
            this.campName = null;
            this.messages = [];
            this.selectedMsngr = null;
            this.selectedMessengers = [];
            for (const msngr of this.messengers) {
              this.messengersList.push(msngr);
            }
            this.$emit('submited')
          })
          .catch((err) => {
            if (err.response.data.message){
              this.errors.push({ messenger: '', field: '', error: `${err.response.data.message}` })
            }
          })
      }
    }

  }
};
</script>