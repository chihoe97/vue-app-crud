<template>
  <div>
    <h1>Cat Facts</h1>

    <table class="table table-hover">
      <thead>
      <tr>
        <td>My facts</td>
        <td></td>
        <td>
          <input type="text" v-model="newFact"/>
          <button style="float: right" class="btn btn-primary btn-sm" v-on:click="addFactToDB">
            Add fact
          </button>
        </td>
      </tr>
      </thead>

      <tbody>
      <tr v-for="fact in factList" :key="fact">
        <td>{{ fact }}</td>
        <td>
          <button id="editBtn" class="btn btn-primary" v-on:click="updateFactToDB(fact)">
            Edit
          </button>
        </td>
        <td>
          <button id="deleteBtn" class="btn btn-primary" v-on:click="deleteFactFromDB(fact)">
            Delete
          </button>
        </td>
      </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import axios from 'axios';

export default {
  name: 'facts',
  data() {
    return {
      newFact: null,
      factList: [],
    };
  },
  setup() {
    const facts = ref([]);
    // Object to pass API for create action
    const createItem = {
      desc: [],
    };
    const getFacts = async () => {
      // Get data from backend
      await axios.get('/api/catFacts/fromSource/').then((data) => {
        if (data && data.data && data.data.length) {
          data.data.forEach((i) => {
            if (i && i.text) {
              // push api response data to array
              facts.value.push(i.text);
              createItem.desc.push(i.text);
            }
          });
        }
      }).catch((err) => {
        throw err;
      });
      // Update response from API to DB
      await axios.post('/api/catFacts/create/', createItem).catch((err) => {
        throw err;
      });
    };
    onMounted(() => {
      getFacts();
    });

    return {
      facts,
    };
  },
  created() {
    this.getFactFromDB();
  },
  methods: {
    async getFactFromDB() {
      await axios.get('/api/catFacts/get/').then((data) => {
        if (data && data.data && data.data.length) {
          this.factList = [];
          data.data.forEach((item) => {
            if (item && item.desc) {
              // push result into array
              this.factList.push(item.desc);
            }
          });
        }
      }).catch((err) => {
        throw err;
      });
    },
    async addFactToDB() {
      if (this.newFact) {
        // return if duplicate
        if (this.factList.includes(this.newFact)) {
          // eslint-disable-next-line no-alert
          alert('Fact existed!');
          return;
        }
        await axios.post('/api/catFacts/create/', { desc: this.newFact }).then(() => {
          // eslint-disable-next-line no-alert
          alert('Added!');
          // Get updated list from DB
          this.getFactFromDB();
        }).catch((err) => {
          throw err;
        });
      }
    },
    async updateFactToDB(item) {
      if (item) {
        let updateTxt;
        // Input field to enter new text to update
        // eslint-disable-next-line no-alert
        const prompBox = prompt('Edit fact:', item);
        if (prompBox && prompBox !== '') {
          updateTxt = prompBox;
          // return if duplicate
          if (this.factList.includes(updateTxt)) {
            // eslint-disable-next-line no-alert
            alert('Fact existed!');
            return;
          }
          await axios.post('/api/catFacts/update/', { desc: item, newDesc: updateTxt }).then(() => {
            // eslint-disable-next-line no-alert
            alert('Updated!');
            // Get updated list from DB
            this.getFactFromDB();
          }).catch((err) => {
            throw err;
          });
        }
      }
    },
    async deleteFactFromDB(item) {
      if (item) {
        await axios.post('/api/catFacts/delete/', { desc: item }).then(() => {
          // eslint-disable-next-line no-alert
          alert('Deleted!');
          // Get updated list from DB
          this.getFactFromDB();
        }).catch((err) => {
          throw err;
        });
      }
    },
  },
};

</script>

<style>
  .table {
    border-collapse: collapse;
    margin:25px auto;
    font-size: 0.9em;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.25);
  }
  .table thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
  }
  .table td {
    padding: 12px 15px;
    text-align: left;
    border-bottom: 1px solid #dddddd;
  }
</style>
