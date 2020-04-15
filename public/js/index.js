/* Variables Globales */
let contadorCantidadFinal = 0,
    renderizar = false;

/* Accediendo Al Dom */
const logo = document.getElementById('logo');
const contenedorCarrito = document.querySelector('.dom-dinamico');
const btnAgregarCarrito = document.querySelectorAll('[data-id]');
const btnCarritoTotal = document.querySelector('.comprar-carrito');
const btnVaciarCarrito = document.querySelector('.vaciar-carrito');

/* Eventos Usuario Y El Sistema */
eventosUsuario();

function eventosUsuario() {
    logo.addEventListener('click', recargarPagina);
    document.addEventListener('DOMContentLoaded', obtenerDatosLocalStorage);
    document.addEventListener('click', cantidadCursosCompra);
    document.addEventListener('click', guardarCursosLocalStorage);
    document.addEventListener('click', eliminarCursoDOM);
    document.addEventListener('click', comprarCursos);
}

/* Funcionalidad Para Recargar El Web Site */
function recargarPagina() {
    location.reload();
}

/* Funcionalidad Para Obtener Los Datos Del Local Storage */
function obtenerDatosLocalStorage() {
    let cursos;

    if (localStorage.getItem('cursos') === null) {
        cursos = [];
    } else {
        cursos = JSON.parse(localStorage.getItem('cursos'));

        if (renderizar === false) {
            renderizarLocalStorageDOM(cursos);
            renderizar = true;
        }
    }

    return cursos;
}

/* Funcionalidad Para Renderizar En El DOM Desde El Local Storage */
function renderizarLocalStorageDOM(cursosArray) {

    cursosArray.forEach((curso) => {
        const img = document.createElement('img');
        const titulo = document.createElement('p');
        const precio = document.createElement('p');
        const divUno = document.createElement('div');
        const divDos = document.createElement('div');
        // const suma = document.createElement('img');
        const cantidad = document.createElement('p');
        // const resta = document.createElement('img');
        const total = document.createElement('p');
        const remove = document.createElement('p');

        remove.setAttribute('data-id', `${curso.id}`);

        img.classList.add('img-carrito');
        divUno.classList.add('referencia');
        // divDos.classList.add('agrupar-cantidad');
        total.classList.add('precio-individual');
        remove.classList.add('curso-individual');

        img.src = `${curso.imagenURL}`;
        titulo.innerHTML = `${curso.titulo}`;
        precio.innerHTML = `${curso.precioNumerico}`;
        // suma.src = `${curso.suma}`;
        cantidad.innerHTML = `${curso.contadorCantidadFinal}`;
        // resta.src = `${curso.resta}`;
        total.innerHTML = `${curso.valorCompra}`;
        remove.innerHTML = 'X';

        divUno.appendChild(divDos);
        // divDos.appendChild(suma);
        divDos.appendChild(cantidad)
            // divDos.appendChild(resta);

        contenedorCarrito.appendChild(img);
        contenedorCarrito.appendChild(titulo);
        contenedorCarrito.appendChild(precio);
        contenedorCarrito.appendChild(divUno);
        contenedorCarrito.appendChild(total);
        contenedorCarrito.appendChild(remove);
    });
}

/* Funcionalidad Para Obtener El Contador De Los Cursos Para Cada Curso */
function cantidadCursosCompra(e) {
    e.preventDefault();

    const hermanoNext = e.target.nextElementSibling;
    const hermanoPrevious = e.target.previousElementSibling;
    let arrayDataId;

    if (e.target.classList.contains('contador-suma')) {
        arrayDataId = Array.from(btnAgregarCarrito);

        arrayDataId.forEach(function(btn) {
            if (btn.getAttribute('data-id') === e.target.getAttribute('add-id')) {
                hermanoNext.innerHTML = (Number(hermanoNext.textContent) + 1);
                contadorCantidadFinal = parseInt(hermanoNext.textContent);
            }
        });

    } else if (e.target.classList.contains('contador-resta')) {
        arrayDataId = Array.from(btnAgregarCarrito);

        arrayDataId.forEach(function(btn) {

            if (btn.getAttribute('data-id') === e.target.getAttribute('rest-id')) {
                if (hermanoPrevious.textContent > 0) {
                    hermanoPrevious.innerHTML = (Number(hermanoPrevious.textContent) - 1);
                    contadorCantidadFinal = parseInt(hermanoPrevious.textContent);

                } else {
                    window.confirm('Actualmente El Carrito Esta Vacio.');
                }
            }
        });
    }
}

/* Funcionalidad Para Guardar Los Datos En El Local Storage */
function guardarCursosLocalStorage(e) {
    e.preventDefault();
    let numeroCursos;

    if (e.target.classList.contains('boton') && numeroCursos !== 0) {

        numeroCursos = Number(e.target.parentElement.parentElement.children[1].children[4].children[0].children[1].innerText)

        if (numeroCursos !== 0) {

            let cursosArray = obtenerDatosLocalStorage();
            let id = e.target.getAttribute('data-id');
            let imagenURL = e.target.parentElement.parentElement.children[0].src;
            let titulo = e.target.parentElement.parentElement.children[1].children[0].textContent;
            let precio = e.target.parentElement.parentElement.children[1].children[3].children[1].innerText;
            let precioNumerico = Number(precio.substr(1));
            let valorCompra = precioNumerico * contadorCantidadFinal;
            /* let suma = e.target.parentElement.parentElement.children[1].children[4].children[0].children[0].src; */
            /* let resta = e.target.parentElement.parentElement.children[1].children[4].children[0].children[2].src; */
            let estado = false;

            let cursoObjeto = {
                estado,
                id,
                imagenURL,
                titulo,
                precioNumerico,
                contadorCantidadFinal,
                valorCompra,
                // suma,
                // resta
            }

            /* No Es Obligatorio Este Codigo Para El Funcionamiento */
            sumaID = e.target.previousElementSibling.children[0].children[0].getAttribute('add-id');
            restaID = e.target.previousElementSibling.children[0].children[2].getAttribute('rest-id');
            btnID = e.target.getAttribute('data-id');

            if (cursosArray.length <= 0) {
                cursoObjeto.estado = true;
                cursosArray.push(cursoObjeto);
                localStorage.setItem('cursos', JSON.stringify(cursosArray));

                renderizarLocalStorageDOM(cursosArray)
                cursoObjeto.contadorCantidadFinal = 0;

            } else if (cursosArray.length >= 1) {

                /* Esta Logica Aplica Para Los Cursos Que Existen En El Local Storage */
                cursosArray.forEach(function(curso, index) {
                    /* Aqui se reescribe la cantidad del los cursos que ya existan en el local storage */
                    if ((curso.id === (sumaID && restaID && btnID && cursoObjeto.id)) && curso.estado === true) {
                        if (curso.id === cursoObjeto.id) {
                            let nuevaCompraCursos;

                            curso.contadorCantidadFinal += contadorCantidadFinal;
                            nuevaCompraCursos = (curso.contadorCantidadFinal * precioNumerico);

                            cursoObjeto.contadorCantidadFinal = curso.contadorCantidadFinal;
                            cursoObjeto.valorCompra = nuevaCompraCursos;
                            cursoObjeto.estado = true;

                            cursosArray.splice(index, 1);
                            cursosArray.push(cursoObjeto);
                            localStorage.setItem('cursos', JSON.stringify(cursosArray));
                            contadorCantidadFinal = 0;

                            /* Forma Optimizada Para Eliminar Del DOM*/
                            while (contenedorCarrito.firstElementChild) {
                                contenedorCarrito.removeChild(contenedorCarrito.firstElementChild);
                            }

                            renderizarLocalStorageDOM(cursosArray);
                        }
                    }
                });

                /* Logica De Agregar Nuevos Cursos Por Fuera Del Ciclo */
                if (cursoObjeto.estado === false) {
                    cursoObjeto.estado = true;
                    cursosArray.push(cursoObjeto);
                    localStorage.setItem('cursos', JSON.stringify(cursosArray));

                    /* Forma Optimizada Para Eliminar */
                    while (contenedorCarrito.firstElementChild) {
                        contenedorCarrito.removeChild(contenedorCarrito.firstElementChild);
                    }

                    renderizarLocalStorageDOM(cursosArray)
                    cursoObjeto.contadorCantidadFinal = 0;
                }
            }
            e.target.previousElementSibling.children[0].children[1].innerHTML = 0;

        } else {
            window.confirm('Ingresar El Número De Cursos A Comprar.');
        }
    }
}

/* Funcionalidad Para Remover Un Curso Del DOM */
/* Funciona, pero existen formas mas optimas de ejecutar esta funcionalidad */
function eliminarCursoDOM(e) {

    if (e.target.classList.contains('curso-individual')) {
        eliminarLocalStorage(e.target);

        e.target.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.remove();

        e.target.previousElementSibling.previousElementSibling.previousElementSibling.previousElementSibling.remove();

        e.target.previousElementSibling.previousElementSibling.previousElementSibling.remove();

        e.target.previousElementSibling.previousElementSibling.remove();

        e.target.previousElementSibling.remove();

        e.target.remove();

    } else if (e.target.classList.contains('vaciar-carrito')) {

        /* Forma Optimizada Para Eliminar Del DOM */
        while (contenedorCarrito.firstElementChild) {
            contenedorCarrito.removeChild(contenedorCarrito.firstElementChild);
        }
        // e.target.parentElement.previousElementSibling.children[1].remove(); Elimina Tambien
        localStorage.clear();
    }
}

/* Funcionalidad Para Eliminar Un Curso Del Local Storage */
function eliminarLocalStorage(elementoDOM) {
    let cursosArray = obtenerDatosLocalStorage();
    let removeDOM = elementoDOM.getAttribute('data-id');

    cursosArray.forEach(function(curso, index) {
        if (curso.id === removeDOM) {
            cursosArray.splice(index, 1);
        }
        localStorage.setItem('cursos', JSON.stringify(cursosArray));
    });

    return false;
}

/* Funcionalidad Para Comprar Todo El Carrito De Compras */
function comprarCursos(e) {
    e.preventDefault();

    if (e.target.classList.contains('comprar-carrito')) {

        const cursosArray = obtenerDatosLocalStorage();
        let valorCurso = 0,
            contadorCompra = 0,
            acumuladorCompra = 0;

        cursosArray.forEach(function(curso) {
            valorCurso = curso.precioNumerico;
            acumuladorCompra += curso.valorCompra;
            contadorCompra += curso.contadorCantidadFinal;
        });

        btnCarritoTotal.style.display = 'none';
        btnVaciarCarrito.style.display = 'none';
        ejecutandoCompra(valorCurso, contadorCompra, acumuladorCompra);
    }
}

/* Funcionalidad Para Renderizar El Resultado Final */
function ejecutandoCompra(precioCurso, numeroCursos, valorCompra) {
    const titulos = document.querySelector('.parte-titulos');
    const div = document.createElement('div');
    const mensaje = document.createElement('div');

    div.classList.add('container-spinner');
    mensaje.classList.add('container-mensaje');

    div.innerHTML = `
        <img src="./assets/img/spinner.gif" />
    `;

    mensaje.innerHTML = `
        <p>\"Felicitaciones, La Educación Es La Mejor Inversión\"</p>
        <p>Valor Curso: <span>$</span>${precioCurso}</p>
        <p>Cursos Comprados: ${numeroCursos}</p>
        <p>Compra Total: <span>$<span>${valorCompra}</p>
    `;

    contenedorCarrito.remove();

    setTimeout(function() {
        titulos.insertAdjacentElement('beforeend', div); //Primer Lugar

        setTimeout(function() {
            div.remove();
            titulos.insertAdjacentElement('beforeend', mensaje); //Primer Lugar
            localStorage.clear();
        }, 4000);

    }, 0.5);
}