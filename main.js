const express = require("express");
const bodyParser = require("body-parser");
const pg = require('pg');
const json = require("body-parser/lib/types/json");

const config = {
  user: 'postgres'
  database: 'apirestDb', 
  password: '123', 
  host: 'loscalhost'
  port: 5432,
  ssl: false,
  idleTimeoutMillis: 30000
}

const client = new pg.Pool(config)

// Modelo
class UserModel {
  constructor() {
    this.usuarios = [];
  }

  async getUsers(){
    const res = await client.query('select * from usuario order by id asc;')
    console.log(res);
    return res.rows
  }

  async addUser(user_nombre, user_edad) {
    const query = 'INSERT INTO usuario(nombre, edad) VALUES($1, $2) RETURNING *';
    const values = [user_nombre, user_edad]
    const res = await client.query(query, values)
    return res;
  }

  async editUser(index, user_nombre, user_edad) {
    const query = 'UPDATE usuario SET nombre=$1, edad=$2 WHERE id=$3 RETURNING *';
    const values = [user_nombre, user_edad, index]
    const res = await client.query(query, values)
    return res;
  }

  async deleteUser(index) {
    const query = 'DELETE FROM usuario WHERE id=$1 RETURNING *';
    const values = [index]
    const res = await client.query(query, values)
    return res;
    // this.todos.splice(index, 1);
  }

  async promedioUser(){
    const res = await client.query('SELECT AVG(id) FROM usuario;')
    console.log(res.rows);
    // json({'promedio': res.rows})
    return res.rows
  }

  statusUser(){
    propertyUser = {
            'namesytem': 'app-users',
            'version': '0.1',
            'developer': 'rudy roger zepita cayoja',
            'email': 'zcroger22@gmail.com'
        }
        console.log(propertyUser);
  }
}

// Controlador
class UserController {
  constructor(model) {
    this.model = model;
  }

  async getUsers() {
   return await this.model.getUsers();
  }

  async addUser(user_nombre, user_edad) {
    await this.model.addUser(user_nombre, user_edad);
  }

  async editUser(index, user_nombre, user_edad) {
    await this.model.editUser(index, user_nombre, user_edad);
  }

  async deleteUser(index) {
    await this.model.deleteUser(index);
  }

  async promedioUser() {
    await this.model.promedioUser();
  }
  statusUserC(){
    this.model.statusUser();
  }
}

// Vistas (Rutas)
const app = express();
const userModel = new UserModel();
const userController = new UserController(userModel);

app.use(bodyParser.json());

app.get("/usuarios",async  (req, res) => {
  const response = await userController.getUsers()
  res.json(response)
});

// Vistas (Rutas) (continuación)
app.post("/usuarios",async (req, res) => {
  const user_nombre = req.body.nombre;
  const user_edad = parseInt(req.body.edad);
  console.log(req.body)
  await userController.addUser(user_nombre, user_edad);
  res.sendStatus(200);
});

app.put("/usuarios/edit/:index", async(req, res) => {
  const index = req.params.index;
  const user_nombre = req.body.nombre;
  const user_edad = parseInt(req.body.edad);
  await userController.editUser(index, user_nombre, user_edad);
  res.sendStatus(200);
});

app.get("/usuarios/delete/:index", async (req, res) => {
  const index = req.params.index;
  await userController.deleteUser(index);
  res.sendStatus(200);
});

app.get("/usuarios/promedio-edad", async (req, res) => {
  
  const prom = await userController.promedioUser();
  res.json(prom);
  res.send(prom);
  
});

app.get("/status",  (req, res) => {
  
  const userDev =  userController.statusUserC();
 
  res.send(userDev);
  
});

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

