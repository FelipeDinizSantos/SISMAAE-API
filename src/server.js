const app = require("./app");
require("dotenv").config();

const PORT = process.env.PORT || 8000;

app.listen(PORT,()=>{
    console.log(`API SISMAAE rodando em porta: ${PORT}`);
});