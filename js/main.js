//Gerneración de cards habitaciones
const seccionHabitaciones = document.getElementById('habitacionesJS');

generarCards(habitaciones);

function generarCards(habitaciones) {
    seccionHabitaciones.innerHTML = '';
    habitaciones.forEach((habitacion) => {
        const div = document.createElement('div');
        div.classList.add('habitacion');
        div.innerHTML = `<div class="habitacion-tipo">
            <img class="habitacion-tipo-imagen" src="${habitacion.imagen}" alt="habitación hotel">
            <div class="habitacion-tipo-info">
                <h3 class="habitacion-tipo-info-nombre">${habitacion.nombre}</h3>
                <p class="habitacion-tipo-info-detalle">${habitacion.descripcion[0]}</p>
                <ul class="habitacion-tipo-info-items">
                    <li>${habitacion.descripcion[1]}</li>
                    <li>${habitacion.descripcion[2]}</li>
                    <li>${habitacion.descripcion[3]}</li>
                    <li>${habitacion.descripcion[4]}</li>
                </ul>
                <div class="habitacion-tipo-info-reserva">
                    <h4 style="color:black; font-size:1.6rem; font-weight:bold; margin-right:4rem">$ ${habitacion.precio}/noche</h4>
                    <button class="btn btn-lg btn-info habitacion-tipo-info-reserva-boton" onclick="agregarAReserva(${habitacion.id})">Reservar</button>
                </div>
            </div>
        </div>`;
        seccionHabitaciones.appendChild(div);
    })
}

//Para saber si tiene reserva anterior y cargarla
if (reservaEnLocal) {
    reserva = reservaEnLocal;
    acumuladorReserva = JSON.parse(localStorage.getItem('totalReserva'));
}

//* Función para agregar noches a la reserva, con todas las llamadas a funciones asociadas */
function agregarAReserva(id) {
    if (document.getElementById('cantidadNoches').value !== '') {
        const cantidadPedida = parseInt(pedirCantidad());
        if (cantidadPedida !== 0) {
            document.getElementById('ingreso0').innerHTML = '';
            const habitacionAgregada = habitaciones.find((el) => el.id === id);
            console.log("stock habit inicial " + habitaciones[id-1].stock);
            if (habitacionAgregada.stock - cantidadPedida >= 0) {
                const subTotal = habitacionAgregada.precio * cantidadPedida;
                acumuladorReserva += subTotal;
                descontarStock(cantidadPedida, id);
                subirAReserva(habitacionAgregada.id, habitacionAgregada.nombre, habitacionAgregada.precio, cantidadPedida);
                mostrarReserva(cantidadPedida, habitacionAgregada.nombre);
                guardarEnLocalStorage();
            } else {
                document.getElementById('agregadoAReserva').innerHTML = `
                <h4 style="font-weight:bold">No hay disponibilidad suficiente. Puede reservar hasta ${habitaciones[id-1].stock} noche/s</h4>
                `
            }
            console.log("stock " + habitaciones[id-1].stock + " acumuladorCarrito " + acumuladorReserva + " al terminar");
        }
    }
    document.getElementById('cantidadNoches').value = '';
}


/**Función para pedir la cantidad de noches a reservar */
function pedirCantidad() {
    let cantidadIngresada = Number(document.getElementById('cantidadNoches').value);
    if (cantidadIngresada !== 0) {
        return cantidadIngresada;
    } else {
        document.getElementById('ingreso0').innerHTML = `<h4 style="color:red">Debe ingresar un número válido</h4>`
        document.getElementById('cantidadNoches').innerHTML = '';
        return 0;
    }
}

//**Función para descontar stock de habitaciones */
function descontarStock(cantidadPedida, id) {
    habitaciones[id-1].stock -= cantidadPedida;
}

//**Función para agregar lo pedido a la reserva */
function subirAReserva(id, nombre, precio, cantidad) {
    reserva.push(new Reserva(id, nombre, precio, cantidad));
    console.log(reserva);
} 

//**Función para mostrar la última habitación agregada */
function mostrarReserva(cantidad, nombre) {
    document.getElementById('agregadoAReserva').innerHTML = `
    <h4 style="font-weight:bold">Se ha agregado a la reserva: ${cantidad} noche/s en habitación ${nombre}</h4>
    `
}

//**Función para guardar la reserva en el localStorage */
function guardarEnLocalStorage() {
    localStorage.setItem('reserva', JSON.stringify(reserva));
    localStorage.setItem('totalReserva', JSON.stringify(acumuladorReserva));
}


/** Generacion de modal Reserva */
const detalleReserva = document.getElementById('modalReserva');
const abrirModal = document.getElementById('reserva');
abrirModal.addEventListener('click', verReserva);
const mostrarTotal = document.getElementById('precioTotal');

function verReserva() {
    const detalleReserva = document.getElementById('modalReserva');
    detalleReserva.innerHTML = '';
    if (acumuladorReserva !== 0) {
        reserva.forEach(element => { 
            const div = document.createElement('div');
            div.innerHTML = `
                <p style="font-size:1.1rem"> Habitación  ${element.nombre}  -  Precio por noche: $ ${element.precio}   -   Total por ${element.cantidad} noche/s :  $ ${element.cantidad*element.precio} .......... <button style="border:none; background-color:white" onclick="eliminarDeReserva(${reserva.indexOf(element)})"><i class="fas fa-minus-circle"></i></button></p>       
                `;
            detalleReserva.appendChild(div);
        });
    } else {
        const div = document.createElement('div');
        div.innerHTML = `
        <div>
            <h4>No hay habitaciones reservadas</h4>
        </div>`;
        detalleReserva.appendChild(div);
    }
    document.getElementById('precioTotal').style.fontWeight = "bold"
    mostrarTotal.innerText = acumuladorReserva;
}

//* Función para eliminar elementos de la reserva (actualiza precio total, stock y local Storage)
function eliminarDeReserva(aux) {
    acumuladorReserva -= reserva[aux].precio * reserva[aux].cantidad;
    devolverCantidadEliminadaAlStock(reserva[aux].id, reserva[aux].cantidad);
    reserva.splice(aux, 1);
    if ((reserva.length) === 0) {
        localStorage.clear();
    } else {
        guardarEnLocalStorage();
    }
    verReserva();
} 

//**Función para devolver al stock la cantidad eliminada de la reserva */
function devolverCantidadEliminadaAlStock(id, cantidad) {
    habitaciones[id-1].stock += cantidad;
    console.log(habitaciones[id-1].stock)
}
