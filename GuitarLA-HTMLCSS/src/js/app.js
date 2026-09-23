import { db } from './guitarra.js';

// Variables
const listaProductos = document.querySelector('#lista-productos');
const carrito = document.querySelector('#carrito');

let carritoItems = [];

// Iniciar aplicación
document.addEventListener('DOMContentLoaded', () => {

    carritoItems = JSON.parse(localStorage.getItem('carrito')) || [];

    mostrarProductos();
    mostrarCarrito();

});

// Mostrar productos
function mostrarProductos() {

    db.forEach(guitarra => {

        const {
            id,
            nombre,
            imagen,
            descripcion,
            precio
        } = guitarra;

        const card = document.createElement('div');

        card.classList.add(
            'col-12',
            'col-md-6',
            'col-lg-4'
        );

        card.innerHTML = `
            <div class="card h-100 border-0 shadow-sm">

                <img 
                    src="${imagen}"
                    class="card-img-top img-fluid"
                    alt="Guitarra ${nombre}"
                >

                <div class="card-body d-flex flex-column">

                    <h3 class="card-title fw-bold">
                        ${nombre}
                    </h3>

                    <p class="card-text text-muted">
                        ${descripcion}
                    </p>

                    <p class="text-primary fs-3 fw-bold mt-auto">
                        $${precio}
                    </p>

                    <button
                        type="button"
                        class="btn btn-dark w-100"
                        data-id="${id}"
                    >
                        Agregar al Carrito
                    </button>

                </div>

            </div>
        `;

        listaProductos.appendChild(card);
    });
}


// Detectar clic en agregar al carrito
listaProductos.addEventListener('click', e => {

    if (e.target.classList.contains('btn-dark')) {

        const id = parseInt(e.target.getAttribute('data-id'));

        agregarCarrito(id);

    }

});


// Agregar producto
function agregarCarrito(id) {

    const producto = db.find(guitarra => guitarra.id === id);

    const existe = carritoItems.find(item => item.id === id);

    if (existe) {

        existe.cantidad++;

    } else {

        carritoItems.push({
            ...producto,
            cantidad: 1
        });

    }

    guardarCarrito();

    mostrarCarrito();
}


// Mostrar carrito
function mostrarCarrito() {

    // Limpiar carrito
    const tbody = carrito.querySelector('tbody');

    if (!tbody) return;

    tbody.innerHTML = '';

    const tabla = carrito.querySelector('table');

    // Carrito vacío
    if (carritoItems.length === 0) {

        carrito.querySelector('p').textContent = 'El carrito está vacío';

        // Ocultar la tabla y resetear el total a $0
        tabla.style.display = 'none';

        actualizarTotal();

        return;
    }

    // Mostrar la tabla cuando hay productos
    tabla.style.display = '';

    // Productos
    carritoItems.forEach(producto => {

        const {
            id,
            nombre,
            precio,
            imagen,
            cantidad
        } = producto;

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>
                <img
                    class="img-fluid"
                    src="${imagen}"
                    alt="Imagen ${nombre}"
                    width="80"
                >
            </td>

            <td>
                ${nombre}
            </td>

            <td class="fw-bold">
                $${precio}
            </td>

            <td>
                <div class="d-flex align-items-center gap-2">

                    <button
                        type="button"
                        class="btn btn-dark btn-sm"
                        data-id="${id}"
                        data-accion="restar"
                    >
                        -
                    </button>

                    <span>
                        ${cantidad}
                    </span>

                    <button
                        type="button"
                        class="btn btn-dark btn-sm"
                        data-id="${id}"
                        data-accion="sumar"
                    >
                        +
                    </button>

                </div>
            </td>

            <td>
                <button
                    class="btn btn-danger btn-sm"
                    type="button"
                    data-id="${id}"
                    data-accion="eliminar"
                >
                    X
                </button>
            </td>
        `;

        tbody.appendChild(row);

    });

    // Actualizar total
    actualizarTotal();

    // Cambiar mensaje
    carrito.querySelector('p').textContent = '';
}


// Eventos del carrito
carrito.addEventListener('click', e => {

    const boton = e.target.closest('button');

    if (!boton) return;

    const id = parseInt(boton.getAttribute('data-id'));
    const accion = boton.getAttribute('data-accion');

    if (accion === 'sumar') {

        aumentarCantidad(id);

    }

    if (accion === 'restar') {

        disminuirCantidad(id);

    }

    if (accion === 'eliminar') {

        eliminarProducto(id);

    }

    if (accion === 'vaciar') {

        vaciarCarrito();

    }

});


// Aumentar cantidad
function aumentarCantidad(id) {

    const producto = carritoItems.find(item => item.id === id);

    if (producto) {

        producto.cantidad++;

        guardarCarrito();
        mostrarCarrito();

    }

}


// Disminuir cantidad
function disminuirCantidad(id) {

    const producto = carritoItems.find(item => item.id === id);

    if (!producto) return;

    if (producto.cantidad > 1) {

        producto.cantidad--;

    } else {

        eliminarProducto(id);
        return;

    }

    guardarCarrito();
    mostrarCarrito();

}


// Eliminar producto
function eliminarProducto(id) {

    carritoItems = carritoItems.filter(item => item.id !== id);

    guardarCarrito();
    mostrarCarrito();

}


// Calcular total
function actualizarTotal() {

    const total = carritoItems.reduce(
        (total, producto) =>
            total + (producto.precio * producto.cantidad),
        0
    );

    const totalElemento = carrito.querySelector('.total-carrito');

    if (totalElemento) {

        totalElemento.textContent = `$${total}`;

    }

}


// Guardar carrito
function guardarCarrito() {

    localStorage.setItem(
        'carrito',
        JSON.stringify(carritoItems)
    );

}

// Vaciar carrito
function vaciarCarrito() {

    carritoItems = [];

    guardarCarrito();
    mostrarCarrito();

}

