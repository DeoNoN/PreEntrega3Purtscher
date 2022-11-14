// ---------------------------Variables---------------------------

let carro = []
let stockTienda = []

let catalogo = document.getElementById("catalogo")
let carroHTML = document.getElementById("carro")
let btnAdd
let btnEre = document.getElementById('btnErease')
let btnCon = document.getElementById('btnConfirm')
let total

let tarjeta

// ---------------------------Funciones---------------------------

function sumaTotal () {

    total = 0
    for (const producto of carro) {

        total = total + producto.precio * producto.cantidad
    }

    document.getElementById('total').remove()

    tarjeta = document.createElement('tr')
    tarjeta.id = 'total'

    tarjeta.innerHTML = `<td colspan="3">Total (IVA incluido)</td>
                        <td>$${total}</td>
                        `

    document.getElementById('carro').append(tarjeta)
}

function addCarro (itemId) {

    // Cancelar si no hay stock
    if (stockTienda.find((producto) => producto.id == itemId).stock < 1) {

        return
    }

    // Sumar a objeto ya existente
    if (carro.some((producto) => producto.id == itemId)) {

        // Cancelar si la cantidad en carro iguala al stock
        if (stockTienda.find((producto) => producto.id == itemId).stock == carro.find((producto) => producto.id == itemId).cantidad) {

            return
        }

        carro = carro.map((producto) => {
        
            if (producto.id == itemId) {

                return{

                    id: producto.id,
                    tipo: producto.tipo,
                    precio: producto.precio,
                    cantidad: +producto.cantidad + 1
                }
            }

            return producto
        })

        //Actualizo cantidad y subtotal en la tarjeta del carro
        barrasCarro = document.getElementById(carro.find((producto) => producto.id == itemId).tipo).getElementsByTagName('td')

        barrasCarro[1].innerText = carro.find((producto) => producto.id == itemId).cantidad

        barrasCarro[3].innerText = '$' + carro.find((producto) => producto.id == itemId).cantidad * carro.find((producto) => producto.id == itemId).precio

        // Actualizar localstorage
        localStorage.setItem('carro', JSON.stringify(carro))

        return
    }

    // Añadir objeto al carro
    carro = carro.concat(stockTienda.filter((producto) => producto.id == itemId).map((producto) => {

        return {
            id: producto.id,
            tipo: producto.tipo,
            precio: producto.precio,
            cantidad: 1
        }
    }))
    //NOTA: Se utiliza ".filter" ya que ".find" produce un error al convertir un carro vacio en un objeto y no un array

    // Crear tarjeta
    tarjeta = document.createElement('tr')
    tarjeta.id = carro.find((producto) => producto.id == itemId).tipo
    
    tarjeta.innerHTML = `<td>Chocolate ${carro.find((producto) => producto.id == itemId).tipo}</td>
                        <td>${carro.find((producto) => producto.id == itemId).cantidad}</td>
                        <td>$${carro.find((producto) => producto.id == itemId).precio}</td>
                        <td>$${(carro.find((producto) => producto.id == itemId).precio) * (carro.find((producto) => producto.id == itemId).cantidad)}</td>
                        `

    carroHTML.append(tarjeta)

    // Actualizar localstorage
    localStorage.setItem('carro', JSON.stringify(carro))

    return
}

function limpiarCarro () {

    for (const producto of carro) {

        document.getElementById(producto.tipo).remove()
    }

    carro = []
    localStorage.clear()
}

function tarjetasCatalogo (tienda) {

    for (const producto of tienda) {

        tarjeta = document.createElement('div')
        tarjeta.className = 'tarjetaCatalogo'
    
        tarjeta.innerHTML = `<h3>Chocolate ${producto.tipo}</h3>
                            <p>Precio: $${producto.precio}<br>stock = ${producto.stock}</p>
                            <img
                            src="${producto.img}"
                            alt="Imagen de muestra de un chocolate ${producto.tipo}" width="250px" height="190px">
                            <button class="btnAdd" id="${producto.id}">Añadir al carro</button>
                            `
    
        catalogo.append(tarjeta)
    }

    // Botones para el carrito
    btnAdd = document.getElementsByClassName('btnAdd')
    for (const boton of btnAdd) {

        boton.onclick = (x) => {
                
            addCarro(x.target.id)
            sumaTotal()
        }
    }
}

// ---------------------------Recuperacion de datos---------------------------

if (localStorage.getItem('carro')) {

    carro = JSON.parse(localStorage.getItem('carro'))

    //Creacion de tarjetas
    for (const producto of carro) {

        tarjeta = document.createElement('tr')
        tarjeta.id = producto.tipo
        
        tarjeta.innerHTML = `<td>Chocolate ${producto.tipo}</td>
                            <td>${producto.cantidad}</td>
                            <td>$${producto.precio}</td>
                            <td>$${producto.precio * producto.cantidad}</td>
                            `

        carroHTML.append(tarjeta)
    }

    sumaTotal()
}

// ---------------------------Catalogo---------------------------

//Clase constructora
class Articulo {

    constructor (id, tipo, precio, stock, img) {

        this.id = id
        this.tipo = tipo.toLowerCase()
        this.precio = precio
        this.stock = stock
        this.img = img
    }
}

//Stock de la tienda
stockTienda.push(new Articulo (0, 'negro', 300, 30, 'https://images.pexels.com/photos/65882/chocolate-dark-coffee-confiserie-65882.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'))
stockTienda.push(new Articulo (1, 'blanco', 200, 25, 'https://images.pexels.com/photos/1854664/pexels-photo-1854664.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'))
stockTienda.push(new Articulo (2, 'suizo', 450, 10, 'https://images.pexels.com/photos/10270060/pexels-photo-10270060.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'))

//Creacion de catalogo

tarjetasCatalogo(stockTienda)

// ---------------------------Limpiar carro de compras---------------------------

btnEre.onclick = () => {

    limpiarCarro()
}

// ---------------------------Confirmar compra---------------------------

btnCon.onclick = () => {

    // Actualizacion de stock en la tienda
    for (const producto of carro) {

        stockTienda = stockTienda.map((tienda) => {

            if (tienda.id == producto.id) {

                return {

                    id: tienda.id,
                    tipo: tienda.tipo,
                    precio: tienda.precio,
                    stock: tienda.stock - producto.cantidad,
                    img: tienda.img
                }
            }

            return tienda
        })
    }

    // Eliminar tarjetas de carro
    document.querySelectorAll('.tarjetaCatalogo').forEach(elemento => {
        
        elemento.remove()
    });

    tarjetasCatalogo(stockTienda)
    limpiarCarro()
    sumaTotal()
}