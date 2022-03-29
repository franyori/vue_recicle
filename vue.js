module.exports = {
  apps : [{
    name        : "produccion_vue",
    script      : "serve -s dist",
    watch       : false,
    env: {
      "NODE_ENV": "development",
    },
    env_production : {
       "NODE_ENV": "production"
    }
  },]
    
};
