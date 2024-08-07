
import express, {Request,Response} from 'express';


const app = express(); // Crea un'applicazione Express
const port =  "3000" // variabile di ambiente
const baseURL ='http://localhost'
const server = express.json(); // Middleware per parsare i dati JSON
// const myApp = new Marketplace() // Crea un'istanza della classe Marketplace
app.use(server);
