/* Variables Globales */
let contadorCantidadFinal = 0,
    renderizar = false;

/* Accediendo Al Dom */
const contenedorCarritoPadre = document.querySelector('.oculto');
const contenedorCarrito = document.querySelector('.contenedor-lista-carrito');

/* Eventos Usuario Y El Sistema */
eventosUsuario();

function eventosUsuario() {
    document.addEventListener('DOMContentLoaded', obtenerDatosLocalStorage);
    document.addEventListener('click', cantidadCursosCompra);
    document.addEventListener('click', guardarCursosLocalStorage);
    document.addEventListener('click', eliminarCursoDOM);
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
    cursosArray.forEach(curso => {

        const img = document.createElement('img');
        const titulo = document.createElement('p');
        const precio = document.createElement('p');
        const divUno = document.createElement('div');
        const divDos = document.createElement('div');
        const suma = document.createElement('img');
        const cantidad = document.createElement('p');
        const resta = document.createElement('img');
        const total = document.createElement('p');
        const remove = document.createElement('p');

        divUno.classList.add('referencia');
        divDos.classList.add('agrupar-cantidad');
        remove.classList.add('curso-individual');

        img.src = `${curso.imagenURL}`;
        titulo.innerHTML = `${curso.titulo}`;
        precio.innerHTML = `${curso.precioNumerico}`;
        suma.src = `${curso.suma}`;
        cantidad.innerHTML = `${curso.contadorCantidadFinal}`;
        resta.src = `${curso.resta}`;
        total.innerHTML = `${curso.valorCompra}`;
        remove.innerHTML = 'X';

        divUno.appendChild(divDos);
        divDos.appendChild(suma);
        divDos.appendChild(cantidad)
        divDos.appendChild(resta);

        contenedorCarrito.appendChild(img);
        contenedorCarrito.appendChild(titulo);
        contenedorCarrito.appendChild(precio);
        contenedorCarrito.appendChild(divUno);
        contenedorCarrito.appendChild(total);
        contenedorCarrito.appendChild(remove);
    });
}

/* Funcionalidad Para Obtener El Contador De Los Cursos */
function cantidadCursosCompra(e) {
    e.preventDefault();

    const hermanoNext = e.target.nextElementSibling;
    const hermanoPrevious = e.target.previousElementSibling;

    if (e.target.classList.contains('contador-suma')) {
        hermanoNext.innerHTML = (Number(hermanoNext.textContent) + 1);
        contadorCantidadFinal = parseInt(hermanoNext.textContent);

    } else if (e.target.classList.contains('contador-resta')) {

        if (hermanoPrevious.textContent > 0) {
            hermanoPrevious.innerHTML = (Number(hermanoPrevious.textContent) - 1);
            contadorCantidadFinal = parseInt(hermanoPrevious.textContent);

        } else {
            window.confirm('Actualmente El Carrito Esta Vacio');
        }
    }

    return contadorCantidadFinal;
}

/* Funcionalidad Para Guardar Los Datos En El Local Storage */
function guardarCursosLocalStorage(e) {
    e.preventDefault();

    if (e.target.classList.contains('boton')) {

        let cursosArray = obtenerDatosLocalStorage();
        let id = e.target.getAttribute('data-id');
        let imagenURL = e.target.parentElement.parentElement.children[0].src;
        let titulo = e.target.parentElement.parentElement.children[1].children[0].textContent;
        let precio = e.target.parentElement.parentElement.children[1].children[3].children[1].innerText;
        let precioNumerico = Number(precio.substr(1));
        let valorCompra = precioNumerico * contadorCantidadFinal;
        let suma = e.target.parentElement.parentElement.children[1].children[4].children[0].children[0].src;
        let resta = e.target.parentElement.parentElement.children[1].children[4].children[0].children[2].src;

        let cursoObjeto = {
            id,
            imagenURL,
            titulo,
            precioNumerico,
            contadorCantidadFinal,
            valorCompra,
            suma,
            resta
        }

        cursosArray.push(cursoObjeto);
        localStorage.setItem('cursos', JSON.stringify(cursosArray));
    }
}

/* Funcionalidad Para Remover Un Curso Del DOM */
function eliminarCursoDOM(e) {

    if (e.target.classList.contains('curso-individual')) {
        console.log(e.target.remove());
    }
}