import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./plugins/base";
import "./plugins/chartist";
import "./plugins/vee-validate";
import vuetify from "./plugins/vuetify";
import i18n from "./i18n";
import Vue2Filters from "vue2-filters";
import VueMoment from "vue-moment";
import moment from "moment-timezone";
import FlashMessage from "@smartweb/vue-flash-message";
Vue.use(FlashMessage)
Vue.use(VueMoment, {
  moment,
});
Vue.use(Vue2Filters);

Vue.config.productionTip = false;

new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App),
}).$mount("#app");
