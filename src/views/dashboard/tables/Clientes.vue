<template>
  <v-data-table :headers="headers" :items="items" sort-by="cedula" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Mis Clientes</v-toolbar-title>
        <v-divider class="mx-4" inset vertical />
        <v-spacer />
        <v-dialog v-model="dialog" max-width="900px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">Nuevo Cliente</v-btn>
          </template>
          <div v-if="formTitle == 'Nuevo'">
            <form id="form" name="form" @submit.prevent="submit(),crearcliente()">
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>

                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="cedula"
                          label="Cedula"
                          type="number"
                          :error-messages="cedulaErrors"
                          :counter="10"
                          required
                          @input="$v.cedula.$touch()"
                          @blur="$v.cedula.$touch()"
                        />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="nombres"
                          label="Nombres"
                          :error-messages="nombresErrors"
                          required
                          @input="$v.nombres.$touch()"
                          @blur="$v.nombres.$touch()"
                        />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="apellidos"
                          label="Apellidos"
                          :error-messages="apellidosErrors"
                          required
                          @input="$v.apellidos.$touch()"
                          @blur="$v.apellidos.$touch()"
                        />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="telefono"
                          label="Telefono"
                          type="number"
                          :error-messages="telefonoErrors"
                          required
                          @input="$v.telefono.$touch()"
                          @blur="$v.telefono.$touch()"
                        />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="direccion"
                          label="Direccion de Habitacion"
                          :error-messages="direccionErrors"
                          required
                          @input="$v.direccion.$touch()"
                          @blur="$v.direccion.$touch()"
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
                  <v-btn color="blue darken-1" text @click="close">Cancelar</v-btn>

                  <v-btn elevation="2" color="success" type="submit">Guardar</v-btn>
                </v-card-actions>
              </v-card>
            </form>
          </div>
          <div v-else>
            <form id="form" name="form" @submit.prevent="updatecliente()">
              <v-card>
                <v-card-title>
                  <span class="text-h5">{{ formTitle }}</span>
                </v-card-title>
                <v-card-text>
                  <v-container>
                    <v-row>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.cedula"
                          label="Cedula"
                          type="number"
                          disabled
                        />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.nombres" label="Nombres" />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.apellidos" label="Apellidos" />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field v-model="editedItem.telefono" label="Telefono" type="number" />
                      </v-col>
                      <v-col cols="12" sm="6" md="4">
                        <v-text-field
                          v-model="editedItem.direccion"
                          label="Direccion de Habitacion"
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
     <v-avatar color="primary" size="30"> <v-icon dark small class="mr-2" @click="editItem(item)">mdi-pencil</v-icon></v-avatar>
    </template>
  </v-data-table>
</template>

<script>
import { Global } from "../../../../Global.js";
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],

  validations: {
    cedula: { required, maxLength: maxLength(10) },
    nombres: { required },
    apellidos: { required },
    telefono: { required },
    direccion: { required }
  },

  data: () => ({
    dialog: false,
    dialogDelete: false,
    headers: [
      {
        align: "start",
        sortable: false,
        value: "name"
      },
      { text: "Cedula", value: "cedula" },
      { text: "Nombres", value: "nombres" },
      { text: "Apellidos", value: "apellidos" },
      { text: "Status", value: "status" },
      { text: "Actions", value: "actions", sortable: false }
    ],
    cedula: "",
    nombres: "",
    apellidos: "",
    direccion: "",
    telefono: "",
    items: [],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      cedula: "",
      nombres: "",
      apellidos: "",
      direccion: "",
      status: "",
      id: ""
    }
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? "Nuevo" : "Editar Cliente";
    },
    cedulaErrors() {
      const errors = [];
      if (!this.$v.cedula.$dirty) return errors;
      !this.$v.cedula.maxLength &&
        errors.push("La Cedula no puede ser mayor a 10 Digistos");
      !this.$v.cedula.required && errors.push("Cedula Requerida");
      return errors;
    },
    nombresErrors() {
      const errors = [];
      if (!this.$v.nombres.$dirty) return errors;
      !this.$v.nombres.required && errors.push("Nombres Requerido");
      return errors;
    },
    apellidosErrors() {
      const errors = [];
      if (!this.$v.apellidos.$dirty) return errors;
      !this.$v.apellidos.required && errors.push("Apellidos Requerido");
      return errors;
    },
    telefonoErrors() {
      const errors = [];
      if (!this.$v.telefono.$dirty) return errors;
      !this.$v.telefono.required && errors.push("Telefono Requerido");
      return errors;
    },
    direccionErrors() {
      const errors = [];
      if (!this.$v.direccion.$dirty) return errors;
      !this.$v.direccion.required && errors.push("Direccion Requerido");
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
    this.listarclientes();
  },

  updated() {
    this.listarclientes();
  },

  methods: {
    submit() {
      this.$v.$touch();
    },

    async listarclientes() {
      await axios
        .get(Global.url + "listar", {
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
    async crearcliente() {
      let parametros = {
        cedula: this.cedula,
        nombres: this.nombres,
        apellidos: this.apellidos,
        telefono: this.telefono,
        direccion: this.direccion,
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
        .post(Global.url + "clientes", parametros, config)
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
    async updatecliente() {
      let parametros = {
        cedula: this.editedItem.cedula,
        nombres: this.editedItem.nombres,
        apellidos: this.editedItem.apellidos,
        telefono: this.editedItem.telefono,
        direccion: this.editedItem.direccion,
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
        .patch(Global.url + "clientesupdate", parametros, config)
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
