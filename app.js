const cards = document.getElementById("cards");
const items = document.getElementById("items");
const footer = document.getElementById("footer");
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById("template-footer").content;
const templateCarrito = document.getElementById("template-carrito").content;
const fragment = document.createDocumentFragment();
let carrito = {};

document.addEventListener("DOMContentLoaded", (e) => {
  fetchData()
  if(localStorage.getItem('carrito')) {
    carrito = JSON.parse(localStorage.getItem('carrito'))
    pintarCarrito()
  }
});
cards.addEventListener("click", (e) => {
  addCarrito(e);
});
items.addEventListener("click", (e) => {
  btnAumentarDisminuir(e);
});

const fetchData = () => {
  $.ajax("./api.json").done(data => {
    pintarCards(data);
  })
};

const pintarCards = (data) => {
  data.forEach((item) => {
    templateCard.querySelector("h5").textContent = item.title;
    templateCard.querySelector("h4").textContent = item.precio;
    templateCard.querySelector("button").dataset.id = item.id;
    templateCard.querySelector("img").setAttribute("src", item.thumbnailUrl);
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

const addCarrito = (e) => {
  if (e.target.classList.contains("btn-dark")) {
    setCarrito(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCarrito = (item) => {
  const producto = {
    title: item.querySelector("h5").textContent,
    precio: item.querySelector("h4").textContent,
    id: item.querySelector("button").dataset.id,
    cantidad: 1,
  };

  if (carrito.hasOwnProperty(producto.id)) {
    producto.cantidad = carrito[producto.id].cantidad + 1;
  }

  carrito[producto.id] = { ...producto };

  pintarCarrito();
};

const pintarCarrito = () => {
  items.innerHTML = "";

  Object.values(carrito).forEach((producto) => {
    templateCarrito.querySelector("th").textContent = producto.id;
    templateCarrito.querySelectorAll("td")[0].textContent = producto.title;
    templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad;
    templateCarrito.querySelector("span").textContent =
      producto.precio * producto.cantidad;
    templateCarrito.querySelector(".btn-info").dataset.id = producto.id;
    templateCarrito.querySelector(".btn-danger").dataset.id = producto.id;

    const clone = templateCarrito.cloneNode(true);
    fragment.appendChild(clone);
  });
  items.appendChild(fragment);

  pintarFooter()

  localStorage.setItem('carrito',JSON.stringify(carrito))


};

const pintarFooter = () => {
  footer.innerHTML = "";

  if (Object.keys(carrito).length === 0) {
    footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>
        `;
    return;
  }

  const nCantidad = Object.values(carrito).reduce(
    (acc, { cantidad }) => acc + cantidad,
    0
  );
  const nPrecio = Object.values(carrito).reduce(
    (acc, { cantidad, precio }) => acc + cantidad * precio,
    0
  );

  templateFooter.querySelectorAll("td")[0].textContent = nCantidad;
  templateFooter.querySelector("span").textContent = nPrecio;

  const clone = templateFooter.cloneNode(true);
  fragment.appendChild(clone);

  footer.appendChild(fragment);

  const boton = document.querySelector("#vaciar-carrito");
  boton.addEventListener("click", () => {
    carrito = {};
    pintarCarrito();
  });

  const botonEncargar = document.querySelector("#comprar-carrito");
  botonEncargar.addEventListener("click", () => {
    carrito = {};
    pintarCarrito();
  });
};

const btnAumentarDisminuir = (e) => {
  if (e.target.classList.contains("btn-info")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad++;
    carrito[e.target.dataset.id] = { ...producto };
    pintarCarrito();
  }

  if (e.target.classList.contains("btn-danger")) {
    const producto = carrito[e.target.dataset.id];
    producto.cantidad--;
    if (producto.cantidad === 0) {
      delete carrito[e.target.dataset.id];
    } else {
      carrito[e.target.dataset.id] = { ...producto };
    }
    pintarCarrito();
  }
  e.stopPropagation();
};

let x = $(document);
x.ready(inicializarEventos);

function inicializarEventos() {
  let x = $("#bt1");
  x.click(ocultarRecuadro);
  x = $("#bt2");
  x.click(mostrarRecuadro);
}

function ocultarRecuadro() {
  let x = $("#Descripcion");
  x.hide();
}

function mostrarRecuadro() {
  let x = $("#Descripcion");
  x.show();
}

$.ajax({


  url:'http://api.openweathermap.org/data/2.5/weather',
  type:"GET",
  data:{
      q:'Rosario',
      appid: 'bbf8893c6e8030e157bb633d11a66e17',
      dataType:"jsonp",
      units: 'metric'
  },
  success:function(data){

      console.log( data);
      let icono = data.weather[0].icon;
      let iconoURL = "http://openweathermap.org/img/w/" + icono + ".png";
      $("#icono").attr("src" , iconoURL);
      let contenido = `<div>
                          <p>${data.name}<br>Temp Max: ${data.main.temp_max}<br>Temp Min: ${data.main.temp_min} </p>
                      </div>`;


      $("#temperatura").append(contenido);



  }


})