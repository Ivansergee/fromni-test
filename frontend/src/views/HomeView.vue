<template>
  <div class="container">
    <div class="columns">
      <div class="column is-6 is-offset-3">
        <div class="level is-mobile">
          <h1 class="title is-4 mb-0">Fromni</h1>
          <button class="button is-success" @click="showModal = true">Добавить</button>
        </div>
        <div class="box" v-for="campaign in campaigns" :key="campaign.id">
          <div class="level is-mobile">
            <div class="level-left">
              <div class="level-item">
                <b>{{ campaign.name }}</b>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <button class="button is-success">Запустить</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddCampModal
      v-if="messengers.length > 0"
      :showModal="showModal"
      :options="messengers"
      @close="showModal = false"
      @added="getCampaigns();"
      @submited="showSubmited"
    />

    <div class="notification is-success" v-if="submited">
      <button class="delete" @click="submited = null"></button>
      Кампания создана!
    </div>
    <div class="notification is-danger" v-if="submited === false">
      <button class="delete" @click="submited = null"></button>
      Что-то пошло не так!
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import AddCampModal from '../components/AddCampModal.vue';

export default {
  components: {
    AddCampModal
  },
  data() {
    return {
      showModal: false,
      campaigns: [],
      messengers: [],
      messengersList: [],
      submited: null
    }
  },
  mounted() {
    this.getCampaigns();
    this.getMessengers();
  },
  methods: {
    async getCampaigns() {
      await axios.get('campaigns/')
        .then((res) => {
          this.campaigns = res.data;
        })
    },
    async getMessengers() {
      await axios.get('messengers/')
        .then((res) => {
          this.messengers = res.data;
        })
    },
    showSubmited(val) {
      if (val) {
        this.submited = true;
      } else {
        this.submited = false;
      }
    }
  }
}
</script>

<style></style>