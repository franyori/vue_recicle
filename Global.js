var ip = require("ip");
//console.log(ip.address());
export var Global = {
  url: `http://${ip.address()}:3000/api/`
   //url:'http://127.0.0.1:3000/api/'
};
