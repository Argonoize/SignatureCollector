<template>
    <div>
        <v-container>
            <h1 style="color: #e3eaff" class="">Signature Collector</h1>
            <div class="row mt-5" v-for="(input, index) in inputs" :key="index">
                <!-- Namenseingabe -->
                <v-text-field style="color: #e3eaff" v-model="input.name" :counter="50" :rules="nameRules" label="Name" prepend-icon="mdi-trash-can-outline" append-icon="mdi-pencil-outline" @click:prepend="deleteRow(index)" @click:append="edit(index)">
                </v-text-field>
                <v-row class="signature" style="outline-color: black; outline-style: solid; outline-width: 1px; margin-bottom: 12px" :id="'sigDiv_' + index">
                    <v-container>
                        <!-- Signaturepad -->
                        <VueSignaturePad style="background-color: #e3eaff;" :id="'signaturePad_' + index" width="98%" height="200px" :ref="'signaturePad_' + index" :options="{options, onBegin}" />
                        <!-- Funktionsbuttons -->
                        <div>
                            <div class="pr-4 pt-3" style="; display: flex; gap: 0.5rem;">
                                <v-spacer></v-spacer>
                                <button class="buttons" style="color: #e3eaff;justify-content: end;" @click="clear(`signaturePad_${index}`)">Löschen</button>
                                <button class="buttons" style="color: #e3eaff;justify-content: end;" @click="undo(`signaturePad_${index}`)">rückgängig</button>
                                <button class="buttons" style="color: #e3eaff;justify-content: end;" @click="save(`signaturePad_${index}`,index)">Speichern</button>
                            </div>
                        </div>
                    </v-container>
                </v-row>
            </div>
            <!-- Hauptbuttons -->
            <v-row class="d-flex justify-center align-baseline py-3">
                <v-col cols="3" style="color: rgb(227, 234, 255);">
                    <v-subheader>Stiftfarbe wählen</v-subheader>
                </v-col>
                <color-input class="customcolor" v-model="color" @change="colorPickEnd()" ref="colorInput" format="hex8" disable-alpha="true" />
                <!-- disable-text-inputs="true" -->
            </v-row>
             <div v-show="isActive">
                <v-form ref="form" v-model="valid" lazy-validation>
                    <v-row class="d-flex justify-center align-baseline py-3 "  style="gap: 1rem">
                        <v-text-field style="color: #e3eaff" v-model="email" :rules="emailRules" label="E-mail" required prepend-icon="mdi-email">
                        </v-text-field>
                        <v-btn @click="sendEmail" style="background-color: #e3eaff" prepend-icon="mdi-email" :disabled="!valid">absenden
                        </v-btn>
                    </v-row>
                </v-form>
            </div >
            <v-row class="d-flex justify-center align-baseline py-3" style="gap: 1rem">
                <v-btn style="background-color: #e3eaff" prepend-icon="mdi-cloud-upload" @click="addRow">Signatur hinzufügen
                </v-btn>
                <v-btn @click="exportAsJSON" style="background-color: #e3eaff" prepend-icon="mdi-cloud-download-outline">JSON downloaden
                </v-btn>
                <v-btn @click="exportAsEmail" style="background-color: #e3eaff" prepend-icon="mdi-email">Email versenden
                </v-btn>
            </v-row>
           
            
        </v-container>
    </div>
</template>

<script>
    import {
        useToast
    } from "vue-toastification";
    class DataDownloader {
        constructor(data = {}) {
            this.data = data;
        }
        download(type_of = "'application/json", filename = "signature.json") {
            let body = document.body;
            const a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([JSON.stringify(this.data, null, 2)], {
                type: type_of
            }));
            a.setAttribute("download", filename);
            body.appendChild(a);
            a.click();
            body.removeChild(a);
            window.URL.revokeObjectURL(a.href)
        }
    }
    const toast = useToast();
    export default {
        data: () => ({
            inputs: [],
            options: {
                penColor: "#000000",
            },
            color: "#000",
            isActive: false,
            valid: false,
            email: '',
            emailRules: [
                v => !!v || 'E-mail ist Pflicht',
                v => /.+@.+\..+/.test(v) || 'Es muss eine gültige E-mail eingegeben werden',
            ],
        }),
        mounted: function() {
            this.inputs.push({
                name: '',
                signature: ''
            });
        },
        methods: {
            addRow() {
                this.inputs.push({
                    name: '',
                    signature: ''
                })
            },
            deleteRow(index) {
                this.inputs.splice(index, 1)
            },
            edit(index) {
                if (document.getElementById('sigDiv_' + index).style.display === "none") {
                    document.getElementById('sigDiv_' + index).style.display = "flex";
                }
            },
            undo(ref) {
                this.$refs[ref][0].undoSignature();
            },
            save(ref, index) {
                const {
                    isEmpty,
                    data
                } = this.$refs[ref][0].saveSignature();
                if (isEmpty) {
                    toast.error("Unterschrift ist leer");
                } else if (this.inputs[index].name == "") {
                    toast.error("Name ist leer");
                } else {
                    var base64result = data.split(',')[1];
                    this.inputs[index].signature = base64result;
                    document.getElementById('sigDiv_' + index).style.display = "none";
                    toast.success("Unterschrift gespeichert für " + this.inputs[index].name);
                }
            },
            clear(ref, index) {
                this.$refs[ref][0].clearSignature();
            },
            exportAsJSON() {
                for (let index = 0; index < this.inputs.length; index++) {
                    const element = this.inputs[index];
                    if (element.name == "") {
                        toast.error("Name ist leer");
                        return;
                    }
                    if (document.getElementById('sigDiv_' + index).style.display !== "none") {
                        toast.error("Bitte die Unterschrift/n speichern");
                        return;
                    }
                }
                new DataDownloader(this.inputs).download();
            },
            exportAsEmail() {
                this.isActive = !this.isActive;
            },
            sendEmail() {
                for (let index = 0; index < this.inputs.length; index++) {
                    const element = this.inputs[index];
                    if (element.name == "") {
                        toast.error("Name ist leer");
                        return;
                    }
                    if (document.getElementById('sigDiv_' + index).style.display !== "none") {
                        toast.error("Bitte die Unterschrift/n speichern");
                        return;
                    }
                }

                this.axios.post('API URL', { input: this.inputs, email: this.email })
                .then((res) => {
                    if(res.data.success) {
                        toast.success("Email versendet. Die Seite wird in 5 Sekunden neu geladen.");
                        setTimeout(function() {
                            window.location.reload();
                        }, 5000);
                    }
                    if(res.data.error) {
                        toast.error("Fehler beim Emailversand");
                    }
                })
            },
            colorPickEnd() {
                const colorInput = this.$refs.colorInput
                this.options = {
                    penColor: "#" + colorInput.color.toHex(),
                }
            },
            onBegin() {
                if(event.target.parentElement.id === "signaturePad_0"){
                    this.$refs.signaturePad_0[0].resizeCanvas();
                }
            }
        }
    }
</script>

<style scope>
    .signature {
        border: double 3px transparent;
        border-radius: 5px;
        background-origin: border-box;
        background-clip: content-box, border-box;
    }
    .container {
        width: "100%";
        padding: 8px 16px;
    }
    .buttons {
        display: flex;
        gap: 8px;
        margin-top: 8px;
    }
    .color-input.user {
        width: 36px !important;
        height: 36px !important;
        align-self: center;
    }
    .color-input.user .color {
        width: 36px !important;
        height: 36px !important;
    }
    .color-input.user .transparent {
        width: 36px !important;
        height: 36px !important;
    }
    .color-input.user .box.active {
        width: 36px !important;
        height: 36px !important;
        background: rgb(50, 50, 50);
    }
</style>