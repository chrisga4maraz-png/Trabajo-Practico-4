document.addEventListener("DOMContentLoaded", () => {

    let carrito = JSON.parse(localStorage.getItem("carritoVictoria")) || [];

    const guardarCarrito = () => {
        localStorage.setItem("carritoVictoria", JSON.stringify(carrito));
    };

    const formatearPrecio = (precio) => {
        return "$" + precio.toLocaleString("es-AR");
    };


    /* =========================
       CONTADORES DEL CARRITO
    ========================= */

    const actualizarContadores = () => {

        const cantidad = carrito.reduce(
            (total, producto) => total + producto.cantidad,
            0
        );

        const total = carrito.reduce(
            (suma, producto) =>
                suma + producto.precio * producto.cantidad,
            0
        );

        const contadorCarrito =
            document.getElementById("contador-carrito");

        const contadorPedido =
            document.getElementById("pedido-contador");

        const totalPedido =
            document.getElementById("pedido-total");

        if (contadorCarrito) {
            contadorCarrito.textContent = cantidad;
        }

        if (contadorPedido) {
            contadorPedido.textContent = cantidad;
        }

        if (totalPedido) {
            totalPedido.textContent = formatearPrecio(total);
        }
    };


    /* =========================
       AGREGAR PRODUCTOS
    ========================= */

    const botonesAgregar =
        document.querySelectorAll(".btn-agregar");

    botonesAgregar.forEach((boton) => {

        boton.addEventListener("click", () => {

            const nombre = boton.dataset.producto;
            const precio = Number(boton.dataset.precio);

            const productoExistente =
                carrito.find(
                    producto => producto.nombre === nombre
                );

            if (productoExistente) {

                productoExistente.cantidad++;

            } else {

                carrito.push({
                    nombre: nombre,
                    precio: precio,
                    cantidad: 1
                });

            }

            guardarCarrito();
            actualizarContadores();

            const textoOriginal = boton.textContent;

            boton.textContent = "✓";
            boton.classList.add("agregado");

            setTimeout(() => {
                boton.textContent = textoOriginal;
                boton.classList.remove("agregado");
            }, 700);

        });

    });


    /* =========================
       FILTROS DE PRODUCTOS
    ========================= */

    const filtros =
        document.querySelectorAll(".filtros button");

    const productos =
        document.querySelectorAll(".producto");

    filtros.forEach((filtro) => {

        filtro.addEventListener("click", () => {

            filtros.forEach((boton) => {
                boton.classList.remove("activo");
            });

            filtro.classList.add("activo");

            const categoria =
                filtro.dataset.categoria;

            productos.forEach((producto) => {

                if (
                    categoria === "todos" ||
                    producto.dataset.categoria === categoria
                ) {

                    producto.style.display = "";

                } else {

                    producto.style.display = "none";

                }

            });

        });

    });


    /* =========================
       BUSCADOR
    ========================= */

    const buscador =
        document.getElementById("buscar-producto");

    if (buscador) {

        buscador.addEventListener("input", () => {

            const texto =
                buscador.value.toLowerCase().trim();

            productos.forEach((producto) => {

                const nombre =
                    producto.dataset.nombre.toLowerCase();

                if (nombre.includes(texto)) {

                    producto.style.display = "";

                } else {

                    producto.style.display = "none";

                }

            });

        });

    }


    /* =========================
       CARRITO
    ========================= */

    const listaCarrito =
        document.getElementById("lista-carrito");

    const subtotalPedido =
        document.getElementById("subtotal-pedido");

    const totalPedidoCarrito =
        document.getElementById("total-pedido");

    const cantidadProductos =
        document.getElementById("cantidad-productos");

    const pedidoVacio =
        document.getElementById("pedido-vacio");


    const renderizarCarrito = () => {

        if (!listaCarrito) {
            return;
        }

        listaCarrito.innerHTML = "";

        if (carrito.length === 0) {

            if (pedidoVacio) {
                pedidoVacio.style.display = "block";
            }

            if (subtotalPedido) {
                subtotalPedido.textContent = "$0";
            }

            if (totalPedidoCarrito) {
                totalPedidoCarrito.textContent = "$0";
            }

            if (cantidadProductos) {
                cantidadProductos.textContent = "0 productos";
            }

            return;
        }


        if (pedidoVacio) {
            pedidoVacio.style.display = "none";
        }


        let subtotal = 0;
        let cantidadTotal = 0;


        carrito.forEach((producto, indice) => {

            const totalProducto =
                producto.precio * producto.cantidad;

            subtotal += totalProducto;
            cantidadTotal += producto.cantidad;


            const imagen =
                obtenerImagenProducto(producto.nombre);


            const item =
                document.createElement("article");

            item.className = "item-carrito";


            item.innerHTML = `
                <div class="item-imagen">
                    <img
                        src="${imagen}"
                        alt="${producto.nombre}"
                    >
                </div>

                <div class="item-info">

                    <div class="item-superior">

                        <div>
                            <span class="producto-categoria">
                                VICTORIA
                            </span>

                            <h3>${producto.nombre}</h3>
                        </div>

                        <button
                            class="btn-eliminar"
                            type="button"
                            data-indice="${indice}"
                            aria-label="Eliminar ${producto.nombre}"
                        >
                            ×
                        </button>

                    </div>

                    <div class="item-inferior">

                        <div class="cantidad">

                            <button
                                class="cantidad-btn"
                                type="button"
                                data-accion="restar"
                                data-indice="${indice}"
                            >
                                −
                            </button>

                            <span>
                                ${producto.cantidad}
                            </span>

                            <button
                                class="cantidad-btn"
                                type="button"
                                data-accion="sumar"
                                data-indice="${indice}"
                            >
                                +
                            </button>

                        </div>

                        <strong class="item-subtotal">
                            ${formatearPrecio(totalProducto)}
                        </strong>

                    </div>

                </div>
            `;


            listaCarrito.appendChild(item);

        });


        if (subtotalPedido) {
            subtotalPedido.textContent =
                formatearPrecio(subtotal);
        }

        if (totalPedidoCarrito) {
            totalPedidoCarrito.textContent =
                formatearPrecio(subtotal);
        }

        if (cantidadProductos) {

            cantidadProductos.textContent =
                cantidadTotal === 1
                    ? "1 producto"
                    : `${cantidadTotal} productos`;

        }


        activarControlesCarrito();

    };


    /* =========================
       IMÁGENES
    ========================= */

    const obtenerImagenProducto = (nombre) => {

        const imagenes = {

            "Café": "../static/img/cafe.jpg",

            "Café con leche":
                "../static/img/cafe-leche.jpg",

            "Capuchino":
                "../static/img/capuchino.jpg",

            "Medialunas":
                "../static/img/medialuna.jpg",

            "Croissant":
                "../static/img/croissant.jpg",

            "Pan artesanal":
                "../static/img/pan.jpg",

            "Porción de torta":
                "../static/img/torta.jpg",

            "Cheesecake":
                "../static/img/cheesecake.jpg",

            "Alfajor":
                "../static/img/alfajor.jpg",

            "Sándwich":
                "../static/img/sandwich.jpg",

            "Tostado":
                "../static/img/tostado.jpg",

            "Jugo natural":
                "../static/img/jugo.jpg",

            "Gaseosa":
                "../static/img/gaseosa.jpg"

        };

        return imagenes[nombre] ||
            "../static/img/cafe.jpg";
    };


    /* =========================
       CONTROLES DEL CARRITO
    ========================= */

    const activarControlesCarrito = () => {

        const botonesCantidad =
            document.querySelectorAll(".cantidad-btn");

        botonesCantidad.forEach((boton) => {

            boton.addEventListener("click", () => {

                const indice =
                    Number(boton.dataset.indice);

                const accion =
                    boton.dataset.accion;


                if (accion === "sumar") {

                    carrito[indice].cantidad++;

                }


                if (accion === "restar") {

                    carrito[indice].cantidad--;

                    if (carrito[indice].cantidad <= 0) {

                        carrito.splice(indice, 1);

                    }

                }


                guardarCarrito();
                actualizarContadores();
                renderizarCarrito();
                renderizarCheckout();

            });

        });


        const botonesEliminar =
            document.querySelectorAll(".btn-eliminar");

        botonesEliminar.forEach((boton) => {

            boton.addEventListener("click", () => {

                const indice =
                    Number(boton.dataset.indice);

                carrito.splice(indice, 1);

                guardarCarrito();
                actualizarContadores();
                renderizarCarrito();
                renderizarCheckout();

            });

        });

    };


    /* =========================
       CHECKOUT
    ========================= */

    const resumenCheckout =
        document.getElementById("resumen-checkout");

    const subtotalCheckout =
        document.getElementById("subtotal-checkout");

    const totalCheckout =
        document.getElementById("total-checkout");


    const renderizarCheckout = () => {

        if (!resumenCheckout) {
            return;
        }

        resumenCheckout.innerHTML = "";

        let subtotal = 0;


        carrito.forEach((producto) => {

            const totalProducto =
                producto.precio * producto.cantidad;

            subtotal += totalProducto;


            const item =
                document.createElement("div");

            item.className = "resumen-item";

            item.innerHTML = `
                <div>
                    <strong>
                        ${producto.nombre}
                    </strong>

                    <span>
                        ${producto.cantidad} ×
                        ${formatearPrecio(producto.precio)}
                    </span>
                </div>

                <strong>
                    ${formatearPrecio(totalProducto)}
                </strong>
            `;

            resumenCheckout.appendChild(item);

        });


        if (subtotalCheckout) {
            subtotalCheckout.textContent =
                formatearPrecio(subtotal);
        }

        if (totalCheckout) {
            totalCheckout.textContent =
                formatearPrecio(subtotal);
        }

    };


    /* =========================
       CONFIRMAR PEDIDO
    ========================= */

    const formulario =
        document.getElementById("formulario-checkout");

    const modal =
        document.getElementById("modal-confirmacion");


    if (formulario) {

        formulario.addEventListener("submit", (evento) => {

            evento.preventDefault();


            if (carrito.length === 0) {

                alert(
                    "Tu pedido está vacío. Agregá algún producto antes de continuar."
                );

                return;
            }


            if (modal) {

                modal.classList.add("activo");

            }

        });

    }


    /* =========================
       INICIALIZACIÓN
    ========================= */

    actualizarContadores();
    renderizarCarrito();
    renderizarCheckout();

});
