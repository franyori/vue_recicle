<template>
<v-data-table :headers="headers" :items="items" sort-by="rif" class="elevation-1">
    <template v-slot:top>
        <v-toolbar flat>
            <v-toolbar-title>Mis Proveedores</v-toolbar-title>
            <v-divider class="mx-4" inset vertical />
            <v-spacer />
            <v-dialog v-model="dialog" max-width="900px">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo Proveedores</v-btn>
                </template>
                <div v-if="formTitle == 'Nuevo'">
                    <form id="form" name="form" @submit.prevent="submit(),crearproveedores()">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="rif" label="Rif" :error-messages="rifErrors" :counter="10" required @input="$v.rif.$touch()" @blur="$v.rif.$touch()" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="razon_social" label="Razón Social" :error-messages="razon_socialErrors" required @input="$v.razon_social.$touch()" @blur="$v.razon_social.$touch()" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="representante_legal" label="Representante Legal" :error-messages="representante_legalErrors" required @input="$v.representante_legal.$touch()" @blur="$v.representante_legal.$touch()" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="telefono_proveedor" label="Telefono" type="number" :error-messages="telefono_proveedorErrors" required @input="$v.telefono_proveedor.$touch()" @blur="$v.telefono_proveedor.$touch()" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="direccion_proveedor" label="Direccion de Habitacion" :error-messages="direccion_proveedorErrors" required @input="$v.direccion_proveedor.$touch()" @blur="$v.direccion_proveedor.$touch()" />
                                        </v-col>

                                        <v-col cols="12" sm="6" md="4">
                                            <v-radio-group v-model="editedItem.status_proveedor" label="Status" mandatory>
                                                <v-radio label="Inactivo" value="INACTIVO" />
                                                <v-radio label="Activo" value="ACTIVO" />
                                            </v-radio-group>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer />
                                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>

                                <v-btn elevation="2" color="success" type="submit">Guardar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </form>
                </div>
                <div v-else>
                    <form id="form" name="form" @submit.prevent="updateproveedores()">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.rif" label="Rif"  disabled />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.razon_social" label="Razón Social" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.representante_legal" label="Representante Legal" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.telefono_proveedor" label="Telefono" type="number" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.direccion_proveedor" label="Direccion de Habitacion" />
                                        </v-col>

                                        <v-col cols="12" sm="6" md="4">
                                            <v-radio-group v-model="editedItem.status_proveedor" label="Status" mandatory>
                                                <v-radio label="Inactivo" value="INACTIVO" />
                                                <v-radio label="Activo" value="ACTIVO" />
                                            </v-radio-group>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer />
                                <input type="hidden" v-model="editedItem.id" name="id" class="form-control" />
                                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                                <v-btn elevation="2" color="success" type="submit">Guardar</v-btn>
                            </v-card-actions>
                        </v-card>
                    </form>
                </div>
            </v-dialog>
        </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
        <v-avatar color="primary" size="30">
            <v-icon dark small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
        </v-avatar>
    </template>
</v-data-table>
</template>

<script>
import {
    Global
} from "../../../../Global.js";
import axios from "axios";
import {
    validationMixin
} from "vuelidate";
import {
    required,
    maxLength
} from "vuelidate/lib/validators";
export default {
    mixins: [validationMixin],

    validations: {
        rif: {
            required,
            maxLength: maxLength(10)
        },
        razon_social: {
            required
        },
        representante_legal: {
            required
        },
        telefono_proveedor: {
            required
        },
        direccion_proveedor: {
            required
        }
    },

    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [{
                align: "start",
                sortable: false,
                value: "name"
            },
            {
                text: "Rif",
                value: "rif"
            },
            {
                text: "Razon Social",
                value: "razon_social"
            },
            {
                text: "Representante Legal",
                value: "representante_legal"
            },
            {
                text: "Status",
                value: "status_proveedor"
            },
            {
                text: "Actions",
                value: "actions",
                sortable: false
            }
        ],
        rif: "",
        razon_social: "",
        representante_legal: "",
        direccion_proveedor: "",
        telefono_proveedor: "",
        items: [],
        desserts: [],
        editedIndex: -1,
        editedItem: {
            rif: "",
            razon_social: "",
            representante_legal: "",
            direccion_proveedor: "",
            status_proveedor: "",
            id: ""
        }
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "Nuevo" : "Editar Cliente";
        },
        rifErrors() {
            const errors = [];
            if (!this.$v.rif.$dirty) return errors;
            !this.$v.rif.maxLength &&
                errors.push("La rif no puede ser mayor a 10 Digistos");
            !this.$v.rif.required && errors.push("Rif Requerido");
            return errors;
        },
        razon_socialErrors() {
            const errors = [];
            if (!this.$v.razon_social.$dirty) return errors;
            !this.$v.razon_social.required && errors.push("Razón Social Requerido");
            return errors;
        },
        representante_legalErrors() {
            const errors = [];
            if (!this.$v.representante_legal.$dirty) return errors;
            !this.$v.representante_legal.required && errors.push("Representante Legal Requerido");
            return errors;
        },
        telefono_proveedorErrors() {
            const errors = [];
            if (!this.$v.telefono_proveedor.$dirty) return errors;
            !this.$v.telefono_proveedor.required && errors.push("Telefono Requerido");
            return errors;
        },
        direccion_proveedorErrors() {
            const errors = [];
            if (!this.$v.direccion_proveedor.$dirty) return errors;
            !this.$v.direccion_proveedor.required && errors.push("Dirección Requerido");
            return errors;
        }
    },

    watch: {
        dialog(val) {
            val || this.close();
        }
    },

    created() {
        this.initialize();

    },

    mounted() {
        this.token = localStorage.token;
        this.listarproveedores();
    },

    updated() {
        this.listarproveedores();
    },

    methods: {
        submit() {
            this.$v.$touch();
        },

        async listarproveedores() {
            await axios
                .get(Global.url + "listarproveedores", {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${this.token}`
                    }
                })
                .then(response => {
                    this.items = response.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        async crearproveedores() {
            let parametros = {
                rif: this.rif,
                razon_social: this.razon_social,
                representante_legal: this.representante_legal,
                telefono_proveedor: this.telefono_proveedor,
                direccion_proveedor: this.direccion_proveedor,
                status_proveedor: this.editedItem.status_proveedor
            };
            let config = {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${this.token}`
                }
            };

            await axios
                .post(Global.url + "proveedores", parametros, config)
                .then(response => {
                    console.log(response.data);
                    document.form.reset();
                    this.close();
                })
                .catch(err => {
                    console.log(err);
                    console.log(parametros);
                });
        },
        async updateproveedores() {
            let parametros = {
                razon_social: this.editedItem.razon_social,
                representante_legal: this.editedItem.representante_legal,
                telefono_proveedor: this.editedItem.telefono_proveedor,
                direccion_proveedor: this.editedItem.direccion_proveedor,
                status_proveedor: this.editedItem.status_proveedor,
                id: this.editedItem.id
            };
            let config = {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${this.token}`
                }
            };
            await axios
                .patch(Global.url + "updateproveedores", parametros, config)
                .then(response => {
                    document.form.reset();
                    this.close();
                })
                .catch(err => {
                    console.log(err);
                    console.log(parametros);
                });
        },
        initialize() {
            this.desserts = [];
        },

        editItem(item) {
            this.editar = true;
            this.editedIndex = this.items.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },

        close() {
            document.form.reset();
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        }
    }
};
</script>
