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
                <router-link :to="{ name: 'detail', params: {id: campaign.id} }"><b>{{ campaign.name }}</b></router-link>
              </div>
            </div>
            <div class="level-right">
              <div class="level-item">
                <button class="button is-success" @click="showRun">Запустить</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <AddCampModal v-if="messengers.length > 0" :showModal="showModal" :messengers="messengers" @close="showModal = false"
      @submited="showSuccess" />

  </div>
</template>

<script>
import axios from 'axios';
import AddCampModal from '../components/AddCampModal.vue';
import { toast } from 'bulma-toast';

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

    showSuccess() {
      this.showModal = false;
      this.getCampaigns();
      toast({
        message: "Кампания создана!",
        type: "is-success",
        dismissible: true,
        duration: 3000,
        pauseOnHover: true,
        position: "top-center",
      });
    },

    showRun() {
      toast({
          message: "Сообщения отправлены!",
          type: "is-success",
          dismissible: true,
          duration: 3000,
          pauseOnHover: true,
          position: "top-center",
        });
    }
  }
}
</script>

<style></style>