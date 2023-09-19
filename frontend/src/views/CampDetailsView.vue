<template>
      <div class="box" v-if="campData">
        <p class="title is-4">Кампания {{ campData.name }}</p>
        <router-link :to="'/'" class="button is-success">Назад</router-link>

        <div class="box mb-3" v-for="message in campData.messages" :key="message.id">
          <p class="title is-4 mb-1">
            {{ message.messenger }} #{{ message.order }}
          </p>

          <div>
            <p><b>Сообщение: </b> <br> <span>{{ message.text }}</span></p>
          </div>

          
          <div v-if="message.keyboard_type">
            <p><b>Клавиатура:</b></p>
            <p>
              <b>&emsp;Тип клавиатуры: </b>
              <span v-if="message.keyboard_type === 'std'">Стандартная</span>
              <span v-if="message.keyboard_type === 'inline'">Inline</span>
            </p>
            <p><b>&emsp;Кнопки:</b></p>
            <div v-for="button in message.buttons" :key="button.id">
              <b>&emsp;&emsp;"{{ button.text }}" </b>
              <span v-if="button.type === 'std'">С быстрым ответом</span>
              <span v-if="button.type === 'link'">С ссылкой</span>
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
      campData: null
    }
  },
  mounted(){
    this.getCampData();
  },
  methods: {
    getCampData() {
      const campId = this.$route.params['id']
      axios
      .get(`/campaigns/${campId}`)
      .then(res => {
        this.campData = res.data[0];
      })
      .catch(err => {
        console.log(err);
      })
    }
  }
};
</script>