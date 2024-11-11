import app from './app.js';

const main =() =>{
    app.listen(app.get('port'));
    console.log('El puerto es: ', app.get('port'))
};
main()

//rutas
// app.get('/pokemon-saludo',(req,res)=> res.send('Hello, pokemon'))
// app.get('/pokemon-despido',(req,res)=> res.send('Chao, pokemon'))
