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
            <button class="delete is-medium" aria-label="close"
              @click="$emit('close'); campName = null, campId = null"></button>
          </div>
        </div>

        <div class="field">
          <label>Название</label>
          <div class="control">
            <input type="text" class="input" :disabled="campId" v-model="campName">
          </div>
        </div>

        <div class="field" >
          <div class="control">
            <button class="button is-success" @click="addCampaign" v-if="!campId">Далее</button>
          </div>
        </div>

        <AddMessage
          v-for="(messenger, index) in selectedMessengers"
          :key="index"
          :msngr="messenger"
          :msngrsLen="options.length"
          :campId="campId"
          :send="sendForms"
          @move-up="moveUp"
          @move-down="moveDown"
          @submited="onSubmit"
          />

        <div class="level" v-if="messengersList.length > 0 && campId">
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

        <div class="field" >
          <div class="control">
            <button class="button is-dark" @click="sendForms = true" v-if="campId">Сохранить</button>
          </div>
        </div>


      </div>
    </div>
    <p class="title" v-if="checkStatus === 'success'">True</p>
    <p class="title" v-if="checkStatus === 'error'">False</p>
    <p class="title" v-if="checkStatus === 'sending'">Sending</p>
  </div>
</template>

<script>
import axios from 'axios';
import AddMessage from './AddMessage.vue'

export default {
  props: ['showModal', 'options'],
  emits: ['close', 'added', 'submited'],
  components: {
    AddMessage
  },
  data() {
    return {
      campName: null,
      campId: null,
      messengersList: [],
      selectedMsngr: null,
      selectedMessengers: [],
      sendForms: false,
      sendStatus: []
    }
  },
  created() {
    for (let msngr of this.options) {
      this.messengersList.push({ id: msngr.id, name: msngr.name })
    }
  },
  computed: {
    checkStatus() {
      if (this.sendStatus.some(result => result.status === null)) {
        return 'sending';
      } else if (this.sendResults.every(result => result.status === true)) {
        return 'success';
      } else {
        return 'error';
      }
    }
  },
  methods: {
    moveUp(id) {
      const index = this.selectedMessengers.findIndex(item => item.id === id);
      if (index > 0) {
        this.selectedMessengers.splice(index - 1, 0, this.selectedMessengers.splice(index, 1)[0]);
        for (let i = 0; i < this.selectedMessengers.length; i++) {
          this.selectedMessengers[i].order = i + 1;
        };
      }
    },
    moveDown(id) {
      const index = this.selectedMessengers.findIndex(item => item.id === id);
      if (index >= 0 && index < this.selectedMessengers.length - 1) {
        this.selectedMessengers.splice(index + 1, 0, this.selectedMessengers.splice(index, 1)[0]);
        for (let i = 0; i < this.selectedMessengers.length; i++) {
          this.selectedMessengers[i].order = i + 1;
        };
      }
    },
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
      if (this.selectedMsngr) {
        const msngrObj = this.messengersList.find(obj => obj.id === this.selectedMsngr);
        msngrObj.order = this.selectedMessengers.length + 1;
        this.selectedMessengers.push(msngrObj);
        this.sendStatus.push({messengerId: msngrObj.id, status: null});

        for (let i = 0; i < this.messengersList.length; i++) {
          if (this.messengersList[i].id === this.selectedMsngr) {
            this.messengersList.splice(i, 1);
            break;
          }
        }
      }
    },

    addCampaign() {
      axios
        .post(`campaigns/`, { name: this.campName })
        .then((resp) => {
          this.campId = resp.data.id;
          this.$emit('added');
        })
        .catch((error) => {
          console.log(error);
        });
    },

    onSubmit(data) {
      this.sendStatus.push(data);
    }
  }
};
</script>