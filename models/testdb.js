//creamos la base de datos tienda y el objeto SHOP donde iremos almacenando la info
var sqlite3 = require('sqlite3').verbose(),
db = new sqlite3.Database('db_test'),
SHOP = {};
 
//elimina y crea la tabla clientes
SHOP.createTable = function()
{
 db.run("DROP TABLE IF EXISTS pruebas");
 db.run("CREATE TABLE IF NOT EXISTS pruebas (id INTEGER PRIMARY KEY AUTOINCREMENT, jsonImg TEXT, jsonInfo TEXT)");
 console.log("La tabla usuarios ha sido correctamente creada");
}
 

 
//inserta un nuevo usuario en la tabla clientes
SHOP.insertPrueba = function(prueba)
{
 var stmt = db.prepare("INSERT INTO pruebas VALUES (?,?,?)");
 stmt.run(null,prueba.jsonImg,prueba.jsonInfo);
 stmt.finalize();
}


//obtenemos todos los clientes de la tabla clientes
//con db.all obtenemos un array de objetos, es decir todos
SHOP.getPruebas = function(callback)
{
 db.all("SELECT * FROM pruebas ORDER BY id desc", function(err, rows) {
 if(err)
 {
 throw err;
 }
 else
 {
 callback(null, rows);
 }
 });
}

//exportamos el modelo para poder utilizarlo con require
module.exports = SHOP;