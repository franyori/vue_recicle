<template>
<v-data-table :headers="headers" :items="productos" sort-by="nombre_producto" class="elevation-1">
    <template v-slot:top>
        <v-toolbar flat>
            <v-toolbar-title>Mis Productos</v-toolbar-title>
            <v-divider class="mx-4" inset vertical />
            <v-spacer />
            <v-dialog v-model="dialog" max-width="900px">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo Producto</v-btn>
                </template>
                <div v-if="formTitle == 'Nuevo'">
                    <form id="form" name="form" @submit.prevent="submit(),crearProducto()">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="nombre_producto" label="Nombre del Producto" :error-messages="nombre_productoErrors" required @input="$v.nombre_producto.$touch()" @blur="$v.nombre_producto.$touch()" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="descripcion_producto" label="Descripcion del Producto" :error-messages="nombre_productoErrors" required @input="$v.descripcion_producto.$touch()" @blur="$v.descripcion_producto.$touch()" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="unidad_medida" label="Unidad de Medidad en Kg" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="precio_costo" label="Precio Costo" type="number" :error-messages="precio_costoErrors" required @input="$v.precio_costo.$touch()" @blur="$v.precio_costo.$touch()" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="precio_venta" label="Precio de Venta" type="number" :error-messages="precio_ventaErrors" required @input="$v.precio_venta.$touch()" @blur="$v.precio_venta.$touch()" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="iva" label="Iva" type="number" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-select v-model="categoriaId" :items="items" :item-text="item => item.nombre" :item-value="item => item.id" :menu-props="{ top: true, offsetY: true }" label="Tipo de Categoria" :error-messages="categoriaIdErrors" required @input="$v.categoriaId.$touch()" @blur="$v.categoriaId.$touch()"></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-radio-group v-model="editedItem.status" label="Status" mandatory>
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
                    <form id="form" name="form" @submit.prevent="updateProducto()">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>

                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.nombre_producto" label="Nombre del Producto" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.descripcion_producto" label="Descripcion del Producto" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.unidad_medida" label="Unidad de Medidad en Kg" disabled />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.precio_costo" label="Precio Costo" type="number" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="editedItem.precio_venta" label="Precio de Venta" type="number" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-select v-model="editedItem.categoriaId" :items="items" :item-text="item => item.nombre" :item-value="item => item.id" :menu-props="{ top: true, offsetY: true }" label="Tipo de Categoria" disabled></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-radio-group v-model="editedItem.status" label="Status" mandatory>
                                                <v-radio label="Inactivo" value="INACTIVO" />
                                                <v-radio label="Activo" value="ACTIVO" />
                                            </v-radio-group>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <input type="hidden" v-model="editedItem.id" name="id" class="form-control" />

                            <v-card-actions>
                                <v-spacer />
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
        <v-avatar size="30" color="primary">
            <v-icon small dark class="mr-2" @click="editItem(item)">mdi-pencil</v-icon>
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
        nombre_producto: {
            required
        },
        descripcion_producto: {
            required
        },
        categoriaId: {
            required
        },
        precio_costo: {
            required
        },
        precio_venta: {
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
                text: "Nombre",
                value: "nombre_producto"
            },
            {
                text: "Descripcion",
                value: "descripcion_producto"
            },
            {
                text: "Tipo de Categoria",
                value: "Categorias.nombre"
            },
            {
                text: "Unidad de Medida en Kg",
                value: "unidad_medida"
            },
            {
                text: "Precio Costo",
                value: "precio_costo"
            },
            {
                text: "Precio de Venta",
                value: "precio_venta"
            },
            {
                text: "Actions",
                value: "actions",
                sortable: false
            }
        ],
        nombre_producto: "",
        descripcion_producto: "",
        categoriaId: "",
        unidad_medida: "Kg",
        precio_costo: "",
        iva: 12,
        precio_venta: "",
        items: [],
        productos: [],
        desserts: [],
        editedIndex: -1,
        editedItem: {
            nombre_producto: "",
            descripcion_producto: "",
            unidad_medida: "",
            precio_costo: "",
            precio_venta: "",
            id: ""
        }
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "Nuevo" : "Editar Producto";
        },
        nombre_productoErrors() {
            const errors = [];
            if (!this.$v.nombre_producto.$dirty) return errors;
            !this.$v.nombre_producto.required &&
                errors.push("Nombre del Producto Requerida");
            return errors;
        },
        descripcion_productoErrors() {
            const errors = [];
            if (!this.$v.descripcion_producto.$dirty) return errors;
            !this.$v.descripcion_producto.required &&
                errors.push("Descripcion del Producto Requerida");
            return errors;
        },
        categoriaIdErrors() {
            const errors = [];
            if (!this.$v.categoriaId.$dirty) return errors;
            !this.$v.categoriaId.required &&
                errors.push("Categoria del Producto Requerida");
            return errors;
        },
        precio_costoErrors() {
            const errors = [];
            if (!this.$v.precio_costo.$dirty) return errors;
            !this.$v.precio_costo.required &&
                errors.push("Precio Costo del Producto Requerido");
            return errors;
        },
        precio_ventaErrors() {
            const errors = [];
            if (!this.$v.precio_venta.$dirty) return errors;
            !this.$v.precio_venta.required &&
                errors.push("Precio Vblueenta del Producto Requerido");
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
        this.listarproductos();
    },

    updated() {
        this.listarcategorias();
        this.listarproductos();
    },


    destroyed() {
        this.token = localStorage.token;
        this.listarcategorias();

    },

    methods: {
        submit() {
            this.$v.$touch();
        },

        async listarcategorias() {
            await axios
                .get(Global.url + "listarcategorias", {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${this.token}`
                    }
                })
                .then(response => {
                    this.items = response.data;
                    // console.log("servicio", this.items);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        async listarproductos() {
            await axios
                .get(Global.url + "listarproductos", {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${this.token}`
                    }
                })
                .then(response => {
                    this.productos = response.data;
                    // console.log("servicio", this.items);
                })
                .catch(error => {
                    console.log(error);
                });
        },
        async crearProducto() {
            let parametros = {
                nombre_producto: this.nombre_producto,
                descripcion_producto: this.descripcion_producto,
                categoriaId: this.categoriaId,
                status: this.editedItem.status,
                unidad_medida: this.unidad_medida,
                precio_costo: this.precio_costo,
                precio_venta: this.precio_venta,
                iva: this.iva
            };
            let config = {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${this.token}`
                }
            };

            await axios
                .post(Global.url + "crearproductos", parametros, config)
                .then(response => {
                    console.log(response.status);
                    console.log(response.data);
                    // this.flashMessage.show({
                    //   status: 'success',
                    //   title: 'Registro Clientes',
                    //   message: 'Hemos Registrado Exitosamente al Empleado.'
                    // })
                    document.form.reset();
                    this.close();
                    // this.$router.push('/empleados')
                })
                .catch(err => {
                    console.log(err);
                    console.log(parametros);
                });
        },
        async updateProducto() {
            let parametros = {
                nombre_producto: this.editedItem.nombre_producto,
                descripcion_producto: this.editedItem.descripcion_producto,
                categoriaId: this.editedItem.categoriaId,
                status: this.editedItem.status,
                unidad_medida: this.editedItem.unidad_medida,
                precio_costo: this.editedItem.precio_costo,
                precio_venta: this.editedItem.precio_venta,
                iva: this.editedItem.iva,
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
                .patch(Global.url + "productosupdate", parametros, config)
                .then(response => {
                    //console.log(response.status);
                    //console.log(response.data);

                    // this.flashMessage.show({
                    //   status: "success",
                    //   title: "Actualizacion del Empleado",
                    //   message: "Hemos Actualizado Exitosamente al Empleado."
                    //});
                    document.form.reset();
                    this.close();
                    //this.$router.push('/empleados?s=1');
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
            this.editedIndex = this.productos.indexOf(item);
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
