const app = require("./app");
require("dotenv").config();

const schedulerMateriais  = require("./schedulers/radaresDispScheduler");

const PORT = process.env.PORT || 8000;

app.listen(PORT,()=>{
    console.log(`API SISMAAE rodando em porta: ${PORT}`);
    schedulerMateriais.iniciar();
});