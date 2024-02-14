import "./assets/main.css";
import piniaPluginPersistedstate from "pinia-plugin-persistedstate";
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

const app = createApp(App);
app.use(router);
app.use(createPinia().use(piniaPluginPersistedstate));
app.mount("#app");
