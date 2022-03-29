<template>
<v-container id="dashboard" fluid tag="section">
    <v-row>
        <v-col cols="12" lg="12">
            <v-card class="mx-auto text-center" color="primary" dark max-width="900">
                <v-card-text>
                    <v-sheet color="rgba(0, 0, 0, .12)">
                        <v-sparkline :value="this.compras" color="rgba(255, 255, 255, .7)" height="100" padding="20" stroke-linecap="round" smooth>
                            <template v-slot:label="item">${{ item.value }}</template>
                        </v-sparkline>
                    </v-sheet>
                </v-card-text>

                <v-card-actions class="justify-center">
                    <v-btn block text>Lista de Compras Diarias</v-btn>
                </v-card-actions>
            </v-card>
        </v-col>
        <v-col cols="12" sm="12" lg="12">
            <v-row justify="space-around">
                <v-col cols="auto">
                    <v-dialog transition="dialog-top-transition" max-width="800">
                        <template v-slot:activator="{ on, attrs }">
                            <v-btn color="primary" v-bind="attrs" v-on="on">Consulta de Compras</v-btn>
                        </template>
                        <template v-slot:default="dialog">
                            <v-card>
                                <v-toolbar color="primary" dark>Consulta de Compras Por Fechas</v-toolbar>
                                <v-form id="form" ref="form" @submit.prevent="listarcomprastotal()">
                                    <v-container>
                                        <v-row>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-select hide-selected v-model="productoId" :items="productos" :item-text="item => item.nombre_producto" :item-value="item => item.id" :menu-props="{ top: true, offsetY: true }" label="Seleccione el Producto"></v-select>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field label="Fecha Desde" v-model="fecha" type="date"></v-text-field>
                                            </v-col>
                                            <v-col cols="12" sm="6" md="4">
                                                <v-text-field v-model="fechados" label="Fecha Hasta" type="date" />
                                            </v-col>
                                            <v-col cols="12" sm="12" md="12">
                                                <v-simple-table>
                                                    <template v-slot:default>
                                                        <thead>
                                                            <tr>
                                                                <th class="text-left">Cliente</th>
                                                                <th class="text-left">Productos</th>
                                                                <th class="text-left">Cantidad</th>
                                                                <th class="text-left">Total del Producto</th>
                                                                <th class="text-left">Status</th>
                                                                <th class="text-left">Fecha</th>

                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            <tr v-for="item in resultado" :key="item.id">
                                                                <td>{{ item.Clientes.nombres }}</td>
                                                                <td>{{ item.Productos.nombre_producto }}</td>
                                                                <td>{{ item.cantidad_compra }}</td>
                                                                <td>{{ item.total_compra | currency('Bs.F ', 2, { decimalSeparator: '.' })}}</td>
                                                                <td>{{ item.status_compra }}</td>
                                                                <td>{{ item.fecha_compras | moment("DD/MM/YYYY") }}</td>

                                                            </tr>
                                                        </tbody>
                                                    </template>
                                                </v-simple-table>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="6">
                                                <v-card-title>
                                                    <v-card-subtitle>Total de Compra</v-card-subtitle>
                                                    <v-chip color="secondary">{{totalporfecha | currency('Bs.F ', 2, { decimalSeparator: '.' })}}</v-chip>
                                                </v-card-title>
                                            </v-col>
                                            <v-col cols="12" sm="12" md="6">
                                                <v-card-title>
                                                    <v-card-subtitle>Total de KG</v-card-subtitle>
                                                    <v-chip color="secondary">{{ parseInt(ctp) }}</v-chip>
                                                </v-card-title>
                                            </v-col>
                                        </v-row>
                                    </v-container>
                                    <v-card-actions>
                                        <v-btn elevation="2" color="primary" type="submit">Consultar</v-btn>
                                    </v-card-actions>
                                </v-form>
                                <v-card-actions class="justify-end">
                                    <v-btn color="primary" text @click="dialog.value = false,clear(),vaciaritems()">Cerrar</v-btn>
                                </v-card-actions>
                            </v-card>
                        </template>
                    </v-dialog>
                </v-col>
            </v-row>
        </v-col>
        <v-col cols="12" sm="6" lg="3">
            <base-material-stats-card color="info" icon="mdi-twitter" title="Followers" value="+245" sub-icon="mdi-clock" sub-text="Just Updated" />
        </v-col>

        <v-col cols="12" sm="6" lg="3">
            <base-material-stats-card color="primary" icon="mdi-poll" title="Website Visits" value="75.521" sub-icon="mdi-tag" sub-text="Tracked from Google Analytics" />
        </v-col>

        <v-col cols="12" sm="6" lg="3">
            <base-material-stats-card color="success" icon="mdi-store" title="Revenue" value="$ 34,245" sub-icon="mdi-calendar" sub-text="Last 24 Hours" />
        </v-col>

        <v-col cols="12" sm="6" lg="3">
            <base-material-stats-card color="orange" icon="mdi-sofa" title="Bookings" value="184" sub-icon="mdi-alert" sub-icon-color="red" sub-text="Get More Space..." />
        </v-col>
    </v-row>
</v-container>
</template>

<script>
import {
    Global
} from "../../../Global";
import axios from "axios";
var moment = require('moment');
export default {
    name: "DashboardDashboard",

    data() {
        return {
            l: 765,
            fechados: '',
            productoId: '',
            fecha: '',
            resultado: [],
            total_pendiente: [],
            resul: [],
            compras: [],
            dailySalesChart: {
                data: {
                    labels: ["L", "M", "M", "J", "V", "S", "D"],
                    series: [
                        [12, 67]
                    ]
                },
                options: {
                    lineSmooth: this.$chartist.Interpolation.cardinal({
                        tension: 0
                    }),
                    low: 0,
                    high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
                    chartPadding: {
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0
                    }
                }
            },

            emailsSubscriptionChart: {
                data: {
                    labels: [
                        "Ja",
                        "Fe",
                        "Ma",
                        "Ap",
                        "Mai",
                        "Ju",
                        "Jul",
                        "Au",
                        "Se",
                        "Oc",
                        "No",
                        "De"
                    ],
                    series: [
                        [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]
                    ]
                },
                options: {
                    axisX: {
                        showGrid: false
                    },
                    low: 0,
                    high: 1000,
                    chartPadding: {
                        top: 0,
                        right: 5,
                        bottom: 0,
                        left: 0
                    }
                },
                responsiveOptions: [
                    [
                        "screen and (max-width: 640px)",
                        {
                            seriesBarDistance: 5,
                            axisX: {
                                labelInterpolationFnc: function (value) {
                                    return value[0];
                                }
                            }
                        }
                    ]
                ]
            }
        };
    },
    computed: {
        totalporfecha() {
            var suma = 0;
            this.resultado.forEach(function (e) {
                suma += e.total_compra
            })
            return (suma);
        },
        ctp() {
            var cattidatotal = 0;
            this.resultado.forEach(function (e) {
                cattidatotal += e.cantidad_compra
            })
            return (cattidatotal);
        },

    },

    mounted() {
        this.token = localStorage.token;
        this.listarcompras();
    },

    updated() {
        this.listarproductos()
        this.listarcomprastotal()
    },

    methods: {
        complete(index) {
            this.list[index] = !this.list[index];
        },

        async listarcompras() {
            await axios
                .get(Global.url + "listarcomprasfechas", {
                    headers: {
                        "Access-Control-Allow-Origin": "*",
                        "Content-type": "Application/json",
                        Authorization: `Bearer ${this.token}`
                    }
                })
                .then(response => {
                    this.resul = response.data;
                    let data_total = [];
                    Object.entries(this.resul).forEach(([key, value]) => {
                        //console.log(`${key} ${value.cantidad_compra}`);
                        return (this.data_total = data_total.push(value.cantidad_compra));
                    });

                    this.compras = data_total;

                    // var su = 0;
                    //   this.total_pendiente = Object.values(this.resul).filter((task) => task.cantidad_compra > 1);
                    //   this.total_pendiente.forEach(function (e) {
                    //       su = e.cantidad_compra
                    //   })
                    //   this.compras = su;
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
        async listarcomprastotal() {
            let parametros = {
                productoId: this.productoId,
                fecha: moment(this.fecha).toDate(),
                fechados: moment(this.fechados).toDate()
            }
            let config = {
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "Content-type": "Application/json",
                    Authorization: `Bearer ${this.token}`
                }
            };
            await axios
                .post(Global.url + "listarproductofechas", parametros, config)
                .then(response => {
                    //console.log(response.status);
                    //console.log(response.data);
                    this.resultado = response.data;
                })
                .catch(err => {
                    console.log(err);
                    console.log(parametros);
                });
        },
        clear() {
            this.productoId = "";
            this.fecha = "";
            this.fechados = "";
        },
        vaciaritems() {
            this.resultado.splice(0, this.resultado.length);

        },
    }
};
</script>
