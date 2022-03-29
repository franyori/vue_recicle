<template>
<v-data-table :headers="headers" :items="respuesta" update: sort-desc sort-by="codigo_venta" class="elevation-1">
    <template v-slot:top>
        <v-toolbar flat>
            <v-toolbar-title>Mis Ventas de Producto</v-toolbar-title>
            <v-divider class="mx-4" inset vertical />
            <v-spacer />
            <v-dialog v-model="dialog" max-width="1024">
                <template v-slot:activator="{ on, attrs }">
                    <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nueva Venta</v-btn>
                </template>
                <div v-if="formTitle == 'Nuevo'">
                    <form id="form" name="form" @submit.prevent="crearVenta()">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-subtitle>
                                <span><strong>Código de Factura:</strong>{{codigocompra}}</span>
                            </v-card-subtitle>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="4" md="3">
                                            <v-select v-model="editedItem.clientesId" :items="items" :item-text="item => item.nombres+' '+item.apellidos" :item-value="item => item.id" :selected="item => item.nombres" :menu-props="{ top: true, offsetY: true }" label="Seleccionar Cliente"></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="4" md="3">
                                            <v-select v-model="editedItem.productoId" :items="productos" :item-text="item => item.nombre_producto" :item-value="item => item.id" @change="onChange()" :menu-props="{ top: true, offsetY: true }" label="Seleccione el Producto"></v-select>
                                        </v-col>
                                        <v-col cols="12" sm="3">
                                            <v-text-field disabled label="Precio Costo" v-model="editedItem.precio_costo" type="number"></v-text-field>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="3">
                                            <v-text-field v-model="editedItem.cantidad_ventas" label="Cantidad a Venta" type="number" />
                                        </v-col>
                                        <v-col cols="12" sm="6" md="3">
                                            <v-text-field v-model="editedItem.precio_ventas" label="Precio de Venta" type="number" />
                                        </v-col>
                                        <v-col cols="12" sm="12" md="3">
                                            <v-row>
                                                <div class="text-h4 mb-2 ">
                                                    <v-chip text-color="black" large label outlined color="blue">Cantidad en Almacen : <v-chip center class="ma-2" large color="blue lighten-2" text-color="black">{{ listataralmacen | currency('KG- ', 2, { decimalSeparator: '.' })}}</v-chip>
                                                    </v-chip>
                                                </div>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="3">
                                            <v-row>
                                                <div class="text-h4 mb-2 ">
                                                    <v-chip text-color="black" large label outlined color="blue">Ganacia Por Producto : <div v-if="perdida==false">
                                                            <v-chip class="ma-2" large color="light-green accent-4" text-color="white">{{ ganacia | currency('Bs.F-  ', 2, { decimalSeparator: '.' })}}</v-chip>
                                                        </div>
                                                        <div v-else>
                                                            <v-chip class="ma-2" large color="red darken-2" text-color="white">{{ ganacia | currency('Estas Perdiendo Bs.F-  ', 2, { decimalSeparator: '.' })}}</v-chip>
                                                        </div>
                                                    </v-chip>
                                                </div>
                                            </v-row>
                                        </v-col>

                                    </v-row>
                                    <div v-if="lista_de_producto > 0 ">
                                        <v-col cols="12" sm="6" md="12">
                                            <v-chip text-color="red" x-large label outlined color="blue">EL Producto" <strong>{{' '+nombreproducto+' '}}</strong>" ya fue Seleccionado</v-chip>
                                        </v-col>
                                    </div>
                                    <div v-else-if="botonguardar">
                                        <v-chip class="ma-2" close color="red" label outlined>No Cuenta Con esa Cantidad a Vender </v-chip>
                                    </div>
                                    <div v-else>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-btn @click="addItem(),clear()" color="pink" dark small bottom>
                                                <v-icon>mdi-plus</v-icon>
                                                Agregar Productos
                                            </v-btn>
                                        </v-col>
                                    </div>
                                </v-container>
                            </v-card-text>
                            <v-col cols="12" sm="12" md="12">
                                <v-simple-table>
                                    <template v-slot:default>
                                        <thead>
                                            <tr>
                                                <th class="text-left">
                                                    Productos
                                                </th>
                                                <th class="text-left">
                                                    Precio Venta
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
                                                <td>{{ item.precio_ventas | currency('Bs.F ', 2, { decimalSeparator: '.' }) }}</td>
                                                <td>{{ item.cantidad_ventas }}</td>
                                                <td>{{ item.total_ventas | currency('Bs.F ', 2, { decimalSeparator: '.' })}}</td>
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
                                <v-card-subtitle>Total de la Venta</v-card-subtitle>
                                <v-chip color="secondary">{{totalitensventas | currency('Bs.F ', 2, { decimalSeparator: '.' })}}</v-chip>
                            </v-card-title>
                            <v-card-actions>
                                <v-col cols="12" sm="6" md="4">
                                    <v-radio-group v-model="editedItem.status_ventas" label="Status de la Venta" mandatory>
                                        <v-radio label="PAGADO" value="PAGADO" />
                                        <v-radio label="PENDIENTE" value="PENDIENTE" />
                                    </v-radio-group>
                                </v-col>

                                <div v-if="selectabonoventa=='PAGADO'">
                                    <v-col cols="12" sm="6" md="12">
                                        <v-text-field v-model="editedItem.abono" disabled label="Abono de la Venta" type="number" />
                                    </v-col>
                                </div>
                                <div v-else>
                                    <v-col cols="12" sm="6" md="12">
                                        <v-text-field v-model="editedItem.abono" label="Abono de la Venta" type="number" />
                                    </v-col>
                                </div>
                                <v-col cols="12" sm="12" md="4">
                                    <v-row>
                                        <div class="text-h4 mb-2 ">
                                            <v-chip text-color="black" large label outlined color="blue">Deuda Pendiente : <v-chip center class="ma-2" large color="red" text-color="black">{{ deuda_pendiente | currency('Bs.F- ', 2, { decimalSeparator: '.' })}}</v-chip>
                                            </v-chip>
                                        </div>
                                    </v-row>
                                </v-col>
                            </v-card-actions>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                                <div v-if="botonguardar">
                                    <v-chip class="ma-2" close color="red" label outlined>No Cuenta Con esa Cantidad a Vender </v-chip>
                                </div>
                                <div v-else>
                                    <v-btn elevation="2" color="success" type="submit">Guardar</v-btn>
                                </div>
                            </v-card-actions>
                        </v-card>
                    </form>
                </div>
                <div v-else>
                    <form id="form" name="form" @submit.prevent="updateVenta(),updateDeudatotal()">
                        <v-card>
                            <v-card-title>
                                <span class="text-h5">{{ formTitle }}</span>
                            </v-card-title>
                            <v-card-text>
                                <v-container>
                                    <v-row>
                                        <v-col cols="12" sm="4" md="4">
                                            <v-select v-model="editedItem.clientesId" disabled :items="items" :item-text="item => item.nombres+' '+item.apellidos" :item-value="item => item.id" :selected="item => item.nombres" :menu-props="{ top: true, offsetY: true }" label="Seleccionr Cliente"></v-select>
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
                                                                Precio Venta
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
                                                        <tr v-for="item in ventasid" :key="item.id">
                                                            <td>{{ item.Almacen.Productos.nombre_producto }}</td>
                                                            <td>{{ item.precio_ventas | currency('Bs.F ', 2, { decimalSeparator: '.' }) }}</td>
                                                            <td>{{ item.cantidad_ventas }}</td>
                                                            <td>{{ item.total_ventas | currency('Bs.F ', 2, { decimalSeparator: '.' })}}</td>
                                                        </tr>
                                                    </tbody>
                                                </template>
                                            </v-simple-table>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="4">
                                            <v-row>
                                                <div class="text-h4 mb-2 ">
                                                    <v-chip text-color="black" large label outlined color="blue">Total de la Venta : <v-chip center class="ma-2" large color="light-green accent-4" text-color="black">
                                                                {{ totalventaporid | currency('Bs.F- ', 2, { decimalSeparator: '.' })}}
                                                        </v-chip>
                                                    </v-chip>
                                                </div>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="4">
                                            <v-row>
                                                <div class="text-h4 mb-2 ">
                                                    <v-chip text-color="black" large label outlined color="blue">Abono de la venta : <v-chip center class="ma-2" large color="primary" text-color="black">{{ totaldeudapendiente | currency('Bs.F- ', 2, { decimalSeparator: '.' })}}</v-chip>
                                                    </v-chip>
                                                </div>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="4">
                                            <v-row>
                                                <div class="text-h4 mb-2 ">
                                                    <v-chip text-color="black" large label outlined color="blue">Total Deuda : <v-chip center class="ma-2" large color="red" text-color="black">{{ totalventaporid - totaldeudapendiente | currency('Bs.F- ', 2, { decimalSeparator: '.' })}}</v-chip>
                                                    </v-chip>
                                                </div>
                                            </v-row>
                                        </v-col>
                                        <v-col cols="12" sm="12" md="12">
                                            <v-simple-table>
                                                <template v-slot:default>
                                                    <thead>
                                                        <tr>
                                                            <th class="text-left">
                                                                Abono Realizado
                                                            </th>
                                                            <th class="text-left">
                                                                Cantidad
                                                            </th>
                                                            <th class="text-left">
                                                                Fecha
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="item in abonos" :key="item.id">
                                                            <td>{{ "Abono Realizado por la Cantidad de:" }}</td>
                                                            <td>{{ item.cantidad_abono | currency('Bs.F ', 2, { decimalSeparator: '.' }) }}</td>
                                                            <td>{{ item.fecha_abono | moment("DD/MM/YYYY")}}</td>
                                                        </tr>
                                                    </tbody>
                                                </template>
                                            </v-simple-table>
                                        </v-col>
                                        <v-col cols="12" sm="6" md="6">
                                            <v-text-field v-model="editedItem.abono" label="Abono de la Venta" type="number" />
                                        </v-col>
                                        <v-col cols="12" sm="12" md="6">
                                            <div v-if="(totalventaporid - totaldeudapendiente) - (cantidadabono) <= 0">
                                                <v-chip center class="ma-2" large color="light-green accent-4" text-color="black">Deuda Cancelada</v-chip>
                                                <div v-if="selectabonoventa== 'PENDIENTE' ">
                                                    <v-radio-group v-model="editedItem.status_ventas" label="Status de la Venta" mandatory>
                                                        <v-radio label="PAGADO" value="PAGADO" />
                                                    </v-radio-group>
                                                </div>
                                            </div>
                                            <div v-else>
                                                <v-radio-group v-model="editedItem.status_ventas" label="Status de la Venta" mandatory>
                                                    <v-radio label="PENDIENTE" value="PENDIENTE" />
                                                </v-radio-group>
                                            </div>
                                        </v-col>
                                    </v-row>
                                </v-container>
                            </v-card-text>
                            <v-card-actions>
                                <v-spacer />
                                <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>
                                <div v-if="botonguardar">
                                    <v-chip class="ma-2" close color="red" label outlined=" false">No Cuenta Con esa Cantidad a Vender </v-chip>
                                </div>
                                <div v-else>
                                    <v-btn elevation="2" color="success" type="submit">Guardar</v-btn>
                                </div>
                                <input type="hidden" v-model="editedItem.id" name="id" class="form-control" />
                            </v-card-actions>
                        </v-card>
                    </form>
                </div>
            </v-dialog>
        </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
        <div v-if="item.status_ventas_fact == 'PENDIENTE'">
            <v-avatar size="30" color="secondary">
                <v-icon color="primary" small="" class="ma-2" @click="editItem(item)">mdi-pencil</v-icon>
            </v-avatar>
        </div>
        <div v-else>
            <v-chip color="primary" text-color="secondary">{{item.status_ventas_fact}}</v-chip>
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
var moment = require("moment");
export default {
    data: () => ({
        dialog: false,
        dialogDelete: false,
        headers: [{
                align: "start",
                sortable: false,
                value: "",
            },
            {
                text: "Nombres del Cliente",
                value: "Clientes.nombres",
            },
            {
                text: "Apellidos del Cliente",
                value: "Clientes.apellidos",
            },
            {
                text: "Status de la Venta",
                value: "status_ventas_fact",
            },
            {
                text: "Total de la Venta",
                value: "total_ventas_fact",
            },
            {
                text: "Código Factura",
                value: "codigo_venta",
            },
            {
                text: "Fecha de la Compras",
                value: "fecha_ventas_fact",
            },
            {
                text: "Actions",
                value: "actions",
                sortable: false,
            },
        ],
        totalidventa:[],
        ventasid: [],
        sumaitemsventas: [],
        resultadoid: [],
        respuesta: [],
        listar: [],
        idcompra: "",
        contador: 1,
        items_compra: [],
        lista_dee_producto: [],
        deuda_total: [],
        sumaiten: 0,
        abonos: [],
        resultados: [],
        product: [],
        Almacen: [],
        productoss: [],
        items: [],
        resul: [],
        productos: [],
        desserts: [],
        editedIndex: -1,
        productoId: "",
        editedItem: {
            productoId: "",
            nombre_producto: "",
            descripcion_producto: "",
            unidad_medida: "",
            precio_costo: 0,
            cantidad_ventas: 0,
            abono: "",
            precio_ventas: "",
            id: "",
            status_ventas: "",
        },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? "Nuevo" : "Editar Venta";
        },
        costo() {
            // el id de producto
            return this.editedItem.productoId;
        },
        fund() {
            // el precio costo
            if (!this.costo) {} else if (this.costo > 0) {
                var mythis = this;
                this.productoss = mythis.productos.find(
                    (productos) => productos.id == this.costo
                );
                return (this.editedItem.precio_costo = mythis.productoss.precio_costo);
            }
        },
        cantidad() {
            return this.editedItem.cantidad_ventas;
        },
        precioventa() {
            return this.editedItem.precio_ventas;
        },

        precio() {
            return this.fund * this.cantidad;
        },
        totalventa() {
            //de total por items
            return this.cantidad * this.precioventa;
        },
        ganacia() {
            return parseInt(this.totalventa) - parseInt(this.precio);
        },

        perdida() {
            return this.precioventa < this.fund;
        },
        listataralmacen() {
            if (!this.costo) {} else if (this.costo > 0) {
                var mythis = this;
                this.product = mythis.productos.find(
                    (productos) => productos.id == this.costo
                );
                return (this.resultados =
                    mythis.product.Almacen[0].cantidad_disponible);
            }
        },
        listaralmacenid() {
            if (!this.costo) {} else if (this.costo > 0) {
                var mythis = this;
                this.product = mythis.productos.find(
                    (productos) => productos.id == this.costo
                );
                return (this.resultadoid = mythis.product.Almacen[0].id);
            }
        },
        botonguardar() {
            if (!this.listataralmacen) {} else {
                return parseInt(this.listataralmacen) <= parseInt(this.cantidad);
            }
        },
        selectabonoventa() {
            return this.editedItem.status_ventas;
        },
        cantidadabono() {
            return parseInt(this.editedItem.abono);
        },
        totaldeudapendiente() {
            var suma = 0;
            this.abonos.forEach(function (e) {
                suma += parseInt(e.cantidad_abono);
            });
            this.sumaiten = suma;
            return suma;
        },
        lista_de_producto() {
            if (!this.costo) {} else if (this.costo > 0) {
                var resta = "";
                this.lista_dee_producto = Object.values(this.items_compra).filter(
                    (task) => task.productoId == this.costo
                );
                this.lista_dee_producto.forEach(function (e) {
                    resta = e.productoId;
                });
                return resta;
            }
        },
        nombreproducto() {
            if (!this.costo) {} else if (this.costo > 0) {
                var mythis = this;
                this.productoss = mythis.productos.find(
                    (productos) => productos.id == this.costo
                );
                return (this.nombredelproducto = mythis.productoss.nombre_producto);
            }
        },
        totalitensventas() {
            let sumatotalventas = 0;
            this.items_compra.forEach(function (e) {
                sumatotalventas += e.total_ventas;
            });
            this.sumaitemsventas = sumatotalventas
            return sumatotalventas;
        },
        codigocompra() {
            this.listar = this.respuesta.length;
            let countPedidos = parseInt(this.listar);
            let countPedidosPlus = countPedidos + 1;
            let numPedido = 0;
            if (countPedidosPlus <= 9) {
                return (numPedido = "000" + countPedidosPlus);
            } else if (countPedidosPlus < 100 && countPedidosPlus >= 10) {
                return (numPedido = "00" + countPedidosPlus);
            } else if (countPedidosPlus < 1000 && countPedidosPlus >= 100) {
                return (numPedido = "0" + countPedidosPlus);
            } else if (countPedidosPlus >= 1000) {
                return (numPedido = countPedidosPlus);
            }
        },
        status_de_ganacia() {
            if (this.perdida == false) {
                return "GANANCIA"
            } else {
                return "PERDIDA"
            }

        },
        deuda_pendiente() {

            return (this.totalitensventas - this.cantidadabono)
        },

        totalventaporid(){
            var sumaven = 0;
            this.ventasid.forEach(e => {
                sumaven += parseInt(e.total_ventas);
            });
             this.totalidventa = sumaven;
            return sumaven;
        }
    },

    watch: {
        dialog(val) {
            val || this.close();
        },
    },

    created() {
        this.initialize();
        this.onChange();
    },

    mounted() {
        this.token = localStorage.token;
        this.listarventas();
        this.listarventasfacturadas();
        this.onChange();
        if (!this.editedItem.id) {} else {
            this.listarabonoventas();
        }
    },

    updated() {
        this.listarventas();
        this.listarclientes();
        this.listarproductos();
        this.listarventasfacturadas();
        this.onChange();
        if (!this.editedItem.id) {} else {
            this.listarventasid();
            this.listarabonoventas();
        }
    },

    methods: {
        onChange() {
            this.editedItem.cantidad_ventas;
        },

        async listarclientes() {
            await axios
                .get(Global.url + "listar", {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${this.token}`,
                    },
                })
                .then((response) => {
                    this.items = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        async listarproductos() {
            await axios
                .get(Global.url + "listarproductos", {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${this.token}`,
                    },
                })
                .then((response) => {
                    this.productos = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        async listarventas() {
            await axios
                .get(Global.url + "listarventas", {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${this.token}`,
                    },
                })
                .then((response) => {
                    this.resul = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        async listarventasfacturadas() {
            await axios
                .get(Global.url + "listarventafacturadas", {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${this.token}`,
                    },
                })
                .then((response) => {
                    this.respuesta = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },

        async crearVenta() {
            let parametros = {
                items: this.items_compra,
                total_deuda: this.deuda_pendiente,
                status_ventas: this.editedItem.status_ventas,
                cantidad_abono: this.editedItem.abono
            };
            let config = {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            };

            await axios
                .post(Global.url + "crearventas", parametros, config)
                .then((response) => {
                    console.log(response.status);
                    console.log(response.data);
                    this.vaciaritems();
                    this.close();
                })
                .catch((err) => {
                    console.log(err);
                    console.log(parametros);
                });
        },

        async listarabonoventas() {
            await axios
                .get(Global.url + "listarabonoventas/" + `${this.editedItem.id}`, {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${this.token}`,
                    },
                })
                .then((response) => {
                    this.abonos = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        async listarventasid() {
            await axios
                .get(Global.url + "listarventasid/" + `${this.editedItem.id}`, {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${this.token}`,
                    },
                })
                .then((response) => {
                    this.ventasid = response.data;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        async updateVenta() {
            let parametros = {
                id: this.editedItem.id,
                cantidad_abono: parseInt(this.editedItem.abono),
                status_abono: this.editedItem.status_ventas,
            };
            let config = {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            };
            await axios
                .post(Global.url + "crearabonos", parametros, config)
                .then((response) => {
                    document.form.reset();
                    this.close();
                })
                .catch((err) => {
                    console.log(err);
                    console.log(parametros);
                });
        },
        async updateDeudatotal() {
            let tota_deuda =
                this.totalventaporid -
                this.totaldeudapendiente -
                this.editedItem.abono;
            let parametros = {
                id: this.editedItem.id,
                status_deuda: this.editedItem.status_ventas,
                total_deuda: tota_deuda,
            };
            let config = {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${this.token}`,
                },
            };
            await axios
                .post(Global.url + "updatedeuda", parametros, config)
                .then((response) => {
                    document.form.reset();
                    this.close();
                })
                .catch((err) => {
                    console.log(err);
                    console.log(parametros);
                });
        },

        initialize() {
            this.desserts = [];
        },

        editItem(item) {
            this.editedIndex = this.respuesta.indexOf(item);
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
        },
        addItem: function () {
            let itemObjeto = {
                idcompra: this.contador++,
                clientesId: this.editedItem.clientesId,
                productoId: this.editedItem.productoId,
                almacenId: this.editedItem.productoId,
                nombre_del_producto: this.nombreproducto,
                cantidad_ventas: this.editedItem.cantidad_ventas,
                precio_ventas: this.editedItem.precio_ventas,
                total_ventas: this.totalventa, //de total por items
                status_ventas: this.editedItem.status_ventas,
                codigo_venta: this.codigocompra,
                almacenId: parseInt(this.listaralmacenid),
                fecha_ventas: moment().format("MM-DD-YYYY"),
                ganacia_venta_global: this.ganacia,
                status_ganacias: this.status_de_ganacia,
            };

            this.items_compra.push(itemObjeto);
        },
        clear() {
            this.editedItem.productoId = "";
            this.editedItem.cantidad_ventas = "";
            this.editedItem.precio_costo = "";
            this.editedItem.precio_ventas = "";
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
    },
};
</script>
