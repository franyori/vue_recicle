<template>
  <div id="app">
    <v-app>
    <v-container style="margin-right: unset;" class="">
      <v-card
        class="overflow-hidden"
        color="pink darken-4"
        dark
        floating
        permanent
        style="height: 300px;width: 500px;left: 200px;"
        
      >
        <v-card-title color="purple darken-3">Ingreso Al Sistema</v-card-title>
        <form name="form" id="form" @submit.prevent="login()">
          <v-container>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="correo"
                  :error-messages="correoErrors"
                  label="Correo"
                  required
                  @input="$v.correo.$touch()"
                  @blur="$v.correo.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" md="12">
                <v-text-field
                  v-model="password"
                  type="password"
                  :error-messages="passwordErrors"
                  :counter="20"
                  label="Contraseña"
                  required
                  @input="$v.password.$touch()"
                  @blur="$v.password.$touch()"
                ></v-text-field>
              </v-col>
            </v-row>

            <v-card-actions class="px-3 pb-3">
              <v-flex text-xs-right>
                <v-btn elevation="2" color="success" type="submit">Ingresar</v-btn>
              </v-flex>

              <v-btn elevation="2" color="error" @click="clear">Limpiar</v-btn>
            </v-card-actions>
          </v-container>
        </form>
        <!-- <FlashMessage :position="'top right'"></FlashMessage> -->
        <FlashMessage></FlashMessage>
      </v-card>
    </v-container>
    </v-app>
  </div>
</template>

<script >
import { Global } from "../../../Global";
import axios from "axios";
import { validationMixin } from "vuelidate";
import { required, maxLength } from "vuelidate/lib/validators";

export default {
  mixins: [validationMixin],

  validations: {
    correo: { required },
    password: { required, maxLength: maxLength(20) }
  },

  data() {
    return {
      correo: "",
      password: ""
    };
  },

  computed: {
    correoErrors() {
      const errors = [];
      if (!this.$v.correo.$dirty) return errors;
      !this.$v.correo.required && errors.push("El Correo es requerida.");
      return errors;
    },

    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.maxLength &&
        errors.push("El nombre no debe ser mayor de 20 Digitos");
      !this.$v.password.required && errors.push("La contraseña es requerida.");
      return errors;
    }
  },

  methods: {
    async login() {
      this.$v.$touch();
      let parametros = {
        correo: this.correo,
        password: this.password
      };
    
      await axios
         .post(Global.url + "login", parametros)
        
        .then(response => {
         // console.log(response.status);
          this.token = localStorage.setItem("token", response.data.token);
          localStorage.setItem("nombre", response.data.Login.nombre);
          localStorage.setItem("token", response.data.token);
          this.flashMessage.show({
            status: "success",
            title: "Inicio de Seccion",
            message: "Bienvenido Al Sistema de Reciclaje Berbeci."
          });
          document.form.reset();
          this.$router.push("/");
        })
        .catch(err => {
          console.log(err);
          console.log(parametros);
          this.flashMessage.show({
            status: "error",
            title: "Error al Iniciar Seccion",
            message: "Los Datos Suministrados Son Incorrectos.",
            time: 9000,
            blockClass: "custom-block-class"
          });
        });
    },

    clear() {
      this.$v.$reset();
      this.correo = "";
      this.password = "";
    }
  }
};
</script>
<style>
 
.bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: url('../../assets/material2.jpg') no-repeat center center;
    background-size: cover;
    
    transform: scale(1.1);
    
  }
</style>