module.exports = {
  apps : [{
    name        : "recicladora_vue",
    script      : "./node_modules/@vue/cli-service/bin/service.js",
    watch       : false,
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },]
    
};
