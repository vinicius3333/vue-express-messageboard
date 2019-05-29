<template>
  <div>
    <button
    @click="showMessageForm = !showMessageForm"
    class="btn btn-info mt-3 mb-3">Show message form</button>
    <form v-if="showMessageForm" @submit.prevent="addMessage()" class="mb-3">
      <div v-if="error" class="alert alert-dismissible alert-warning">
        <button type="button" class="close" data-dismiss="alert">&times;</button>
        <h4 class="alert-heading">Error!</h4>
        <p class="mb-0">{{error}}</p>
      </div>
      <div class="form-group">
        <label for="username">Username</label>
        <input v-model="message.username"
        type="text"
        class="form-control"
        id="username"
        required>
      </div>
      <div class="form-group">
        <label for="subject">Subject</label>
        <input v-model="message.subject"
        type="text"
        class="form-control"
        id="subject"
        placeholder="Enter a subject"
        required>
      </div>
      <div class="form-group">
        <label for="message">Message</label>
        <textarea v-model="message.message"
        class="form-control"
        id="message"
        rows="3"></textarea>
      </div>
      <div class="form-group">
        <label for="imgURL">imgURL</label>
        <input v-model="message.imgURL"
        type="url"
        class="form-control"
        id="imgURL"
        placeholder="Put a Image">
      </div>
      <div class="form-group">
        <label for="password">Password</label>
        <input v-model="message.password"
        class="form-control"
        id="password"
        placeholder="Password"
        type="password">
      </div>
      <button type="submit" class="btn btn-primary">Add Message</button>
    </form>
    <div class="list-unstyled" v-for="(message, index) in reverseMessages" :key="message._id">
      <li class="media" >
        <img v-if="message.imgURL" :src="message.imgURL" class="mr-3" :alt="message.subject">
        <div class="media-body">
          <div class="col-4" style="float: right;">
            <label for="password">Password</label>
            <input v-model="passwords[index]"
              class="form-control"
              id="password"
              placeholder="Password"
              type="password">
            <button @click="removeMessage(message._id, index)"
              type="button"
              class="btn btn-danger">Delete</button>
            <div v-if="modalPassword" class="alert alert-dismissible alert-danger mt-2">
              <button @click="modalPassword = !modalPassword"
              type="button" class="close">&times;</button>
              <p>{{errorPassword}}</p>
            </div>
          </div>
          <div class="col-8">
            <h4 class="mt-0 mb-1">{{message.username}}</h4>
            <h5 class="mt-0 mb-1">{{message.subject}}</h5>
          </div>
          {{message.message}}
          <br />
          <small>{{message.created}}</small>
        </div>
      </li>
      <hr>
    </div>
  </div>
</template>

<script>
const API_URL = '/messages';

export default {
  name: 'home',
  data: () => ({
    messages: [],
    message: {
      username: 'Anonymous',
      subject: '',
      message: '',
      imgURL: '',
      password: '',
    },
    showMessageForm: false,
    error: '',
    passwords: [],
    errorPassword: '',
    modalPassword: false,
  }),
  computed: {
    reverseMessages() {
      return this.messages ? this.messages.slice().reverse() : [];
    },
  },
  mounted() {
    fetch(API_URL)
      .then(response => response.json())
      .then((result) => {
        this.messages = result;
      });
  },
  methods: {
    addMessage() {
      fetch(API_URL, {
        method: 'POST',
        body: JSON.stringify(this.message),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then(response => response.json())
        .then((result) => {
          if (result.details) {
            const error = result.details.map(detail => detail.message).join('.');
            this.error = error;
          } else {
            this.error = '';
            this.showMessageForm = false;
            this.messages.push(result);
          }
        });
    },
    removeMessage(_id, index) {
      fetch(API_URL, {
        method: 'DELETE',
        body: JSON.stringify({
          id: _id,
          password: this.passwords[index],
        }),
        headers: {
          'content-type': 'application/json',
        },
      })
        .then(response => response.json())
        .then((result) => {
          if (result.error) {
            this.errorPassword = result.error;
            this.modalPassword = true;
          } else {
            this.errorPassword = '';
            this.passwords[index] = '';
            this.getAll();
          }
        });
    },
    getAll() {
      fetch(API_URL)
        .then(response => response.json())
        .then((result) => {
          this.messages = result;
        });
    },
  },
};
</script>

<style>
hr {
  border-top: 1px solid white;
}

img {
  max-width: 300px;
  height: auto;
}
</style>
