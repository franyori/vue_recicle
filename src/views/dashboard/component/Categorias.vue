<template>
  <v-data-table :headers="headers" :items="items" sort-by="nombre" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Mis Categorias</v-toolbar-title>
        <v-divider class="mx-4" inset vertical />
        <v-spacer />
        <v-dialog v-model="dialog" max-width="900px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo Categoria</v-btn>
          </template>
          <div v-if="formTitle == 'Nuevo'">
            <form id="form" name="form" @submit.prevent="crearCategorias()">
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.nombre" label="Nombre de La Categoria" />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.descripcion"
                          label="Descripcion de la Categoria"
                        />
                      </v-col>

                      <v-radio-group v-model="editedItem.status" label="Status" mandatory>
                        <v-radio label="Inactivo" value="INACTIVO" />
                        <v-radio label="Activo" value="ACTIVO" />
                      </v-radio-group>
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
            <form id="form" name="form" @submit.prevent="updateCategorias()">
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.nombre" label="Nombre de La Categoria" />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.descripcion"
                          label="Descripcion de la Categoria"
                        />
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
   <v-avatar size="30" color="primary">  <v-icon small dark class="mr-2" @click="editItem(item)">mdi-pencil</v-icon></v-avatar> 
    </template>
  </v-data-table>
</template>

<script>
import { Global } from "../../../../Global.js";
import axios from "axios";

export default {
  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        align: "start",
        sortable: false,
        value: "name"
      },
      { text: "Nombre", value: "nombre" },
      { text: "Descripcion", value: "descripcion" },
      { text: "Status", value: "status" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    items: [],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      nombre: "",
      descripcion: "",
      status: "",
      id: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo" : "Editar Categoria";
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
    this.listarCategorias();
  },

  updated() {
    this.listarCategorias();
  },

  methods: {
    async listarCategorias() {
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
    async crearCategorias() {
      let parametros = {
        nombre: this.editedItem.nombre,
        descripcion: this.editedItem.descripcion,
        status: this.editedItem.status
      };
      let config = {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-type": "Application/json",
          Authorization: `Bearer ${this.token}`
        }
      };

      await axios
        .post(Global.url + "categorias", parametros, config)
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
    async updateCategorias() {
      let parametros = {
        nombre: this.editedItem.nombre,
        descripcion: this.editedItem.descripcion,
        status: this.editedItem.status,
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
        .patch(Global.url + "categoriasupdate", parametros,config)
        .then(response => {
          console.log(response.status);
          console.log(response.data);
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
      this.editar = true;
      this.editedIndex = this.items.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    close() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    }
  }
};
</script>
