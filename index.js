const express = require('express');
const app = express();
const fs = require('fs');
app.use(express.json());

// funcion para taer data de tareas.json
const getTareas = () => {
    const fsRespuesta = fs.readFileSync('tareas.json', 'utf8');
    const tareas = JSON.parse(fsRespuesta);
    return tareas;
};

// mostrando todo el array
app.get("/tareas", (req, res) => {
    const tareas = getTareas();// trae tareas desde la funcion
    res.json(tareas);
});

// buscando tarea especifica segun parametro enviado :id
app.get("/tareas/:id", (req, res) => {
    const tareas = getTareas();// trae tareas desde la funcion
    const id = req.params.id;
    const tarea = tareas.find(item => item.id === parseInt(id));

    if (!tarea){
        res.status(404).json( {mensaje: "Tarea NO encontrada"} );
    } else {
        res.json(tarea);
    };
});

// agregando tareas
app.post("/tareas", (req, res) => {
    const { tarea } = req.body;
    const id = Math.floor(Math.random() * 9999);
    const nuevaTarea = {
        id: id,
        tarea: tarea,
        estado: false
    };
    let tareas = getTareas();// trae tareas desde la funcion
    tareas.push(nuevaTarea);
    fs.writeFileSync('tareas.json', JSON.stringify(tareas));
    res.status(201).json(nuevaTarea);
});

// modificando tareas
app.put("/tareas/:id", (req, res) => {
    const id = req.params.id;
    let tareas = getTareas();// trae tareas desde la funcion
    const tarea = tareas.find((tarea) => tarea.id === parseInt(id));

    if (!tarea){
        res.status(404).json({mensaje: "Tarea NO encontrada"});
    } else {
        tareas = tareas.map((tarea) => {
            if (tarea.id === id) {
            return { ...tarea, done: !tarea.done };
            }
            return tarea;
        });
    };

    fs.writeFileSync("tareas.json", JSON.stringify(tareas));
    res.json(tareas);

});

// eliminando tareas

// corriendo servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`servidor corriendo.... en puerto: ${PORT}`));