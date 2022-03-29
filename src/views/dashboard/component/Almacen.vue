<template>
<v-data-table :headers="headers" :items="items" sort-by="nombre" class="elevation-1">
    <template v-slot:top>
        <v-toolbar flat>
            <v-toolbar-title>Mis Amacen</v-toolbar-title>

            <v-divider class="mx-4" inset vertical />
            <div v-if="id >= 1">
                <v-alert dense outlined type="error">
                    En Mi lista de Productos Me estoy Quedando
                    <strong>Sin</strong>
                    <strong>Stock</strong>
                </v-alert>
            </div>
            <div v-else>
            </div>
            <v-spacer />
        </v-toolbar>
    </template>
</v-data-table>
</template>

<script>
import {
    Global
} from "../../../../Global.js";
import axios from "axios";

export default {
    data: () => ({
        headers: [{
                align: "start",
                sortable: false,
                value: "name"
            },
            {
                text: "Nombre del Producto",
                value: "Productos.nombre_producto"
            },
            {
                text: "Status del Producto",
                value: "Productos.status",

            },
            {
                text: "En Stock",
                value: "cantidad_disponible"
            }
        ],
        items: [],
        productos: [],
        desserts: [],
        editedIndex: -1,
        editedItem: {
            nombre: "",
            descripcion: "",
            status: "",
            id: ""
        }
    }),

    mounted() {
        this.token = localStorage.token;
        this.listaralmacen();
    },

    updated() {
    },

    computed: {
        id() {
            this.productos = Object.values(this.items).filter(
                task => task.cantidad_disponible <= 1
            );
            return this.productos.length;
        }
    },
    methods: {
        async listaralmacen() {
            await axios
                .get(Global.url + "listaralmacen", {
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
        }
    }
};
</script>
