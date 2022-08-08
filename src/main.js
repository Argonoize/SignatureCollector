import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import VueSignaturePad from 'vue-signature-pad';
import ColorInput from 'vue-color-input'

import Toast from "vue-toastification";
// Import the CSS or use your own!
import "vue-toastification/dist/index.css";

loadFonts()

const options = {
    // You can set your default options here
};

createApp(App)
    .use(vuetify)
    .use(VueSignaturePad)
    .use(Toast, options)
    .use(ColorInput)
    .mount('#app')