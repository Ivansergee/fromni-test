<template>
  <div class="container">
    <div class="columns">
        <div class="column is-6 is-offset-3">
            <h1 class="title is-4">Fromni</h1>
            <div class="box" v-for="campaign in campaigns" :key="campaign.id">
                {{ campaign.name }}
            </div>
        </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
    data(){
        return {
            campaigns: []
        }
    },
    mounted() {
        this.getCampaigns();
    },
    methods: {
        getCampaigns(){
            axios.get('campaigns/')
            .then((res) => {
                this.campaigns = res.data;
            })
        }
    }
}
</script>

<style>

</style>