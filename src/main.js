import { createApp } from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import { loadFonts } from './plugins/webfontloader'
import VueSignaturePad from 'vue-signature-pad';

loadFonts()

createApp(App)
    .use(vuetify)
    .use(VueSignaturePad)
    .mount('#app')