import Vue from "vue";
import Vuex from "vuex";
import axios from "@/helpers/axios";
import { ADD_NEWS } from "./mutationTypes";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    newsList: []
  },
  mutations: {
    [ADD_NEWS](state, news) {
      state.newsList = [...state.newsList, ...news];
    }
  },
  actions: {
    async fetchNews({ commit }) {
      const response = await axios.get("/api/topNews");
      if (response.data.result && response.data.result.stat === "1") {
        commit(ADD_NEWS, response.data.result.data);
      }
    }
  },
  modules: {}
});
