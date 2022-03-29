<template>
<v-data-table :headers="headers" :search="search" :items="resul" update: sort-desc sort-by="fecha_compras" class="elevation-1">
    <template v-slot:top>
        <v-toolbar flat>
            <v-toolbar-title>Compras de Productos</v-toolbar-title>
            <v-row>
                <v-col cols="12" sm="6" md="3">
                    <v-divider class="mx-4" inset vertical />
                    <span>{{ new Date() | moment("DD/MM/YYYY") }}</span>
                </v-col>
                <v-row>
                    <div class="text-center ma-2">
                        <v-col cols="12" sm="6" md="3">
                            <v-btn color="primary" @click="snackbar = true">
                                Monto de deudas Pendiente
                            </v-btn>
                            <v-snackbar v-model="snackbar">
                                {{pendiente | currency('Bs.F  ', 2, { decimalSeparator: '.' })}}

                                <template v-slot:action="{ attrs }">
                                    <v-btn color="secondary" text v-bind="attrs" @click="snackbar = false">
                                        Cerrar
                                    </v-btn>
                                </template>
                            </v-snackbar>
                        </v-col>
                    </div>
                </v-row>
            </v-row>
            <v-spacer></v-spacer>
            <v-row>
                <v-col cols="12" sm="6" md="12">
                    <v-card>
                        <v-card-title>
                            <v-text-field v-model="search" append-icon="mdi-magnify" label="Buscar" single-line hide-details></v-text-field>
                        </v-card-title>
                    </v-card>
                </v-col>
            </v-row>
            <v-spacer></v-spacer>
            <v-spacer />
            <v-dialog v-model="dialog" max-width="900px">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo Compra</v-btn>
                </template>
                <validation-observer ref="observer" v-slot="{ invalid }">
                    <div v-if="formTitle == 'Nuevo'">
                        <v-form id="form" ref="form">
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-card-subtitle>
                                        <span><strong>Codigo de Factura:</strong>{{codigocompra}}</span>
                                    </v-card-subtitle>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="4">
                                                <validation-provider v-slot="{ errors }" name="Proveedor" rules="required">
                                                    <v-select required :error-messages="errors" v-model="editedItem.proveedoresId" :items="items" :item-text="item => item.razon_social" :item-value="item => item.id" :selected="item => item.razon_social" :menu-props="{ top: true, offsetY: true }" label="Seleccionar Proveedor"></v-select>
                                                </validation-provider>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-select hide-selected v-model="editedItem.productoId" :items="productos" :item-text="item => item.nombre_producto" :item-value="item => item.id" @change="onChange()" :menu-props="{ top: true, offsetY: true }" label="Seleccione el Producto"></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Precio" v-model="editedItem.precio_costo" type="number"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <validation-provider v-slot="{ errors }" name="Cantidad" rules="required">
                                                    <v-text-field required :error-messages="errors" v-model="editedItem.cantidad_compra" label="Cantidad a Comprar" type="number" />
                                                </validation-provider>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-row class="mb-6">
                                                    <v-card-title>
                                                        <div class="text-h4 mb-2">Total Del Producto</div>
                                                        <v-chip class="ma-2" large color="green" text-color="white">{{precio | currency('Bs.F  ', 2, { decimalSeparator: '.' })}}</v-chip>
                                                    </v-card-title>
                                                </v-row>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-radio-group v-model="editedItem.status_compra" label="Status del Pago" mandatory>
                                                    <v-radio label="PAGADO" value="PAGADO" />
                                                    <v-radio label="PENDIENTE" value="PENDIENTE" />
                                                </v-radio-group>
                                            </v-col>
                                            <div v-if="lista_de_producto > 0">
                                                <v-col cols="12" sm="6" md="12">
                                                    <v-chip text-color="red" x-large label outlined color="blue">EL Producto" <strong>{{' '+nombreproducto+' '}}</strong>" ya fue Seleccionado</v-chip>
                                                </v-col>
                                            </div>
                                            <div v-else>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-btn :disabled="invalid" @click="addItem(),clear()" color="pink" dark small bottom>
                                                        <v-icon>mdi-plus</v-icon>
                                                        Agregar Productos
                                                    </v-btn>
                                                </v-col>
                                            </div>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-simple-table>
                                                    <template v-slot:default>
                                                        <thead>
                                                            <tr>
                                                                <th class="text-left">
                                                                    Productos
                                                                </th>
                                                                <th class="text-left">
                                                                    Precio
                                                                </th>
                                                                <th class="text-left">
                                                                    Cantidad
                                                                </th>
                                                                <th class="text-left">
                                                                    Total del Producto
                                                                </th>
                                                                <th class="text-left">
                                                                    Acciones
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="item in items_compra" :key="item.idcompra">
                                                                <td>{{ item.nombre_del_producto }}</td>
                                                                <td>{{ item.precio_costo | currency('Bs.F ', 2, { decimalSeparator: '.' }) }}</td>
                                                                <td>{{ item.cantidad_compra }}</td>
                                                                <td>{{ item.total_compra | currency('Bs.F ', 2, { decimalSeparator: '.' })}}</td>
                                                                <td>
                                                                    <v-icon small @click="deleteItem(item)">
                                                                        mdi-delete
                                                                    </v-icon>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </template>
                                                </v-simple-table>
                                            </v-col>
                                            <v-card-title>
                                                <v-card-subtitle>Total de Compra</v-card-subtitle>
                                                <v-chip color="secondary">{{totalporfecha | currency('Bs.F ', 2, { decimalSeparator: '.' })}}</v-chip>
                                            </v-card-title>
                                        </v-row>
                                    </v-container>
                                </v-card-text>
                                <v-card-actions>
                                    <v-spacer />
                                    <v-btn color="blue darken-1" text @click="close(),vaciaritems()">Cancelar</v-btn>
                                    <v-btn elevation="2" :disabled="invalid" color="success" @click="submit(),crearCompra()">Guardar</v-btn>
                                </v-card-actions>
                            </v-card>
                        </v-form>
                    </div>
                    <div v-else>
                        <form id="form" name="form" @submit.prevent="updateCompra()">
                            <v-card>
                                <v-card-title>
                                    <span class="text-h5">{{ formTitle }}</span>
                                </v-card-title>
                                <v-card-text>
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-select disabled v-model="editedItem.proveedoresId" :items="items" :item-text="item => item.razon_social" :item-value="item => item.id" :selected="item => item.razon_social" :menu-props="{ top: true, offsetY: true }" label="Seleccionar Proveedor"></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-simple-table>
                                                    <template v-slot:default>
                                                        <thead>
                                                            <tr>
                                                                <th class="text-left">
                                                                    Productos
                                                                </th>
                                                                <th class="text-left">
                                                                    Precio Compra
                                                                </th>
                                                                <th class="text-left">
                                                                    Cantidad
                                                                </th>
                                                                <th class="text-left">
                                                                    Total del Producto
                                                                </th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="item in compraid" :key="item.id">
                                                                <td>{{ item.Productos.nombre_producto }}</td>
                                                                <td>{{ item.Productos.precio_costo | currency('Bs.F ', 2, { decimalSeparator: '.' }) }}</td>
                                                                <td>{{ item.cantidad_compra }}</td>
                                                                <td>{{ item.total_compra| currency('Bs.F ', 2, { decimalSeparator: '.' })}}</td>
                                                            </tr>
                                                        </tbody>
                                                    </template>
                                                </v-simple-table>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field disabled v-model="editedItem.total_fact_compra" :items="items" :item-text="item => item.total_fact_compra" label="Total a Pagar" type="number" />
                                                {{editedItem.total_compra | currency('Bs.F ', 2, { decimalSeparator: '.' })}}
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-radio-group v-model="editedItem.status_compra" label="Status del Pago" mandatory>
                                                    <v-radio label="PAGADO" value="PAGADO" />
                                                    <v-radio label="PENDIENTE" value="PENDIENTE" />
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
                </validation-observer>
            </v-dialog>
        </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
        <div v-if="item.status_fact_compra == 'PENDIENTE'">
            <v-avatar size="30" color="secondary">
                <v-icon color="primary" small="" class="ma-2" @click="editItem(item)">mdi-pencil</v-icon>
            </v-avatar>
        </div>
        <div v-else>
            <v-chip color="primary" text-color="secondary">{{item.status_fact_compra}}</v-chip>
        </div>
    </template>
</v-data-table>
</template>

<script>
import {
    Global
} from "../../../../Global.js";
import axios from "axios";
import Vue2Filters from "vue2-filters";
import {
    required,
    digits,
    email,
    max,
    regex
} from 'vee-validate/dist/rules'
import {
    extend,
    ValidationObserver,
    ValidationProvider,
    setInteractionMode
} from 'vee-validate'
var moment = require('moment');
setInteractionMode('eager')
extend('required', {
    ...required,
    message: '{_field_} Requerido',
})
export default {
    components: {
        ValidationProvider,
        ValidationObserver,
    },
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [{
                align: "start",
                sortable: false,
                value: ""
            },
            {
                text: "Rif del Proveedor",
                value: "Proveedores.rif"
            },
            {
                text: "Razón Social del Proveedor",
                value: "Proveedores.razon_social"
            },
            {
                text: "Status de la Compra",
                value: "status_fact_compra"
            },
            {
                text: "Monto de la Compra",
                value: "total_fact_compra"
            },
            {
                text: "Codigo Compra",
                value: "codigo_compra"
            },
            {
                text: "Fecha Compras",
                value: "fecha_fact_compra"
            },
            {
                text: "Actions",
                value: "actions",
                sortable: false
            }
        ],
        search: '',
        snackbar: false,
        idcompra: '',
        contador: 1,
        compraid: [],
        listar: [],
        lista_dee_producto: [],
        nombredelproducto: [],
        items_compra: [],
        total_pendiente: [],
        productoss: [],
        items: [],
        resul: [],
        productos: [],
        desserts: [],
        editedIndex: -1,
        editedItem: {

            nombre_producto: "",
            descripcion_producto: "",
            unidad_medida: "",
            precio_costo: [],
            cantidad_compra: [],
            total_compra: "",
            precio_venta: "",
            status_compra: "",
            id: "",
            productoId: []
        },

    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "Nuevo" : "Editar Producto";
        },

        costo() {

            return this.editedItem.productoId;
        },

        fund() {

            if (!this.costo) {} else if (this.costo > 0) {
                var mythis = this;
                this.productoss = mythis.productos.find(
                    productos => productos.id == this.costo
                );
                return (this.editedItem.precio_costo = mythis.productoss.precio_costo);
            }
        },
        nombreproducto() {

            if (!this.costo) {} else if (this.costo > 0) {
                var mythis = this;
                this.productoss = mythis.productos.find(
                    productos => productos.id == this.costo
                );
                return (this.nombredelproducto = mythis.productoss.nombre_producto);
            }
        },

        cantidad() {
            return this.editedItem.cantidad_compra;
        },
        precio() {
            return this.fund * this.cantidad;
        },

        pendiente() {
            var suma = 0;
            this.total_pendiente = Object.values(this.resul).filter((task) => task.status_compra == "PENDIENTE");
            this.total_pendiente.forEach(function (e) {
                suma += e.total_compra
            })
            return (suma);

        },
        lista_de_producto() {
            if (!this.costo) {} else if (this.costo > 0) {
                var resta = ''
                this.lista_dee_producto = Object.values(this.items_compra).filter((task) => task.productoId == this.costo);
                this.lista_dee_producto.forEach(function (e) {
                    resta = e.productoId
                })
                return (resta);
            }
        },
        codigocompra() {
            this.listar = this.resul.length;
            let countPedidos = parseInt(this.listar)
            let countPedidosPlus = countPedidos + 1
            let numPedido = 0
            if (countPedidosPlus <= 9) {
                return numPedido = '000' + countPedidosPlus
            } else if (countPedidosPlus < 100 && countPedidosPlus >= 10) {
                return numPedido = '00' + countPedidosPlus
            } else if (countPedidosPlus < 1000 && countPedidosPlus >= 100) {
                return numPedido = '0' + countPedidosPlus
            } else if (countPedidosPlus >= 1000) {
                return numPedido = countPedidosPlus
            }
        },
        totalporfecha() {
            var suma = 0;
            this.items_compra.forEach(function (e) {
                suma += e.total_compra
            })
            return (suma);
        },

    },

    watch: {
        dialog(val) {
            val || this.close();
        }
    },

    created() {
        this.initialize();
        this.onChange();
    },

    mounted() {
        this.token = localStorage.token;
        this.listarcompras();
        this.listarproductos();
        this.onChange();
    },

    updated() {
        this.listarcompras();
        this.listarproveedores();
        this.listarproductos();
        this.onChange();
        if (!this.editedItem.id) {} else {
            this.listarcompraid();
        }
    },

    methods: {
        onChange() {
            this.editedItem.cantidad_compra;
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
                })
                .catch(error => {
                    console.log(error);
                });
        },

        async listarcompras() {
            await axios
                .get(Global.url + "listarcomprasfacturadas", {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${this.token}`
                    }
                })
                .then(response => {
                    this.resul = response.data;
                })
                .catch(error => {
                    console.log(error);
                });
        },
        async listarcompraid() {
            await axios
                .get(Global.url + "listarcompraid/" + `${this.editedItem.id}`, {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${this.token}`,
                    },
                })
                .then((response) => {
                    this.compraid = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        async crearCompra() {
            let parametros = {
                items: this.items_compra,
                total_fact_compra: this.totalporfecha,
                status_fact_compra: this.editedItem.status_compra
            };
            let config = {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${this.token}`
                }
            };

            await axios
                .post(Global.url + "crearcompras", parametros, config)
                .then(response => {
                    console.log(response.data);
                    this.vaciaritems()
                    this.close();
                })
                .catch(err => {
                    console.log(err);
                    console.log(parametros);
                });
        },
        async updateCompra() {
            let parametros = {
                status_compra: this.editedItem.status_compra,
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
                .patch(Global.url + "comprasupdate", parametros, config)
                .then(response => {
                    console.log(response.status);
                    console.log(response.data);
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
            this.editedIndex = this.resul.indexOf(item);
            this.editedItem = Object.assign({}, item);
            this.dialog = true;
        },

        close() {
            this.dialog = false;
            this.$nextTick(() => {
                this.editedItem = Object.assign({}, this.defaultItem);
                this.editedIndex = -1;
            });
        },

        addItem: function () {
            let itemObjeto = {
                idcompra: this.contador++,
                proveedoresId: this.editedItem.proveedoresId,
                productoId: this.editedItem.productoId,
                nombre_del_producto: this.nombreproducto,
                cantidad_compra: this.editedItem.cantidad_compra,
                precio_costo: this.fund,
                total_compra: this.precio,
                status_compra: this.editedItem.status_compra,
                fecha_compras: moment().format("MM-DD-YYYY"),
                status_historico: "COMPRA",
                fecha_historico: moment().format("MM-DD-YYYY"),
                codigo_compra: this.codigocompra
            }

            this.items_compra.push(itemObjeto)
        },
        clear() {
            this.editedItem.productoId = "";
            this.editedItem.cantidad_compra = "";
            this.editedItem.precio_costo = "";
            this.editedItem.status_compra;
            this.tipo_de_cuenta = null;
        },
        deleteItem(item) {
            var index = this.items_compra.indexOf(item);
            this.items_compra.splice(index, 1);
        },
        vaciaritems() {
            this.items_compra.splice(0, this.items_compra.length);

        },
        submit() {
            this.$refs.observer.validate()
        },

    }
};
</script>
