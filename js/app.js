const criptomonedaSelect = document.querySelector('#criptomonedas');
const monedaSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');
const ObjBusqueda = {
    moneda: '',
    criptomoneda: ''
}

//Crear un promise
const obtenerCriptomonedas = criptomoneda => new Promise( resolve => {
    resolve(criptomoneda)
});

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptomonedas();

    formulario.addEventListener('submit', submitFormulario);

    criptomonedaSelect.addEventListener('change', leerValor)
    monedaSelect.addEventListener('change', leerValor)
})

async function consultarCriptomonedas(){
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( resultado => obtenerCriptomonedas(resultado.Data) )
        .then( criptomonedas => selectCriptomonedas(criptomonedas) )

    try {
        const respuesta = await fetch(url);
        const resultado = await respuesta.json();
        const criptomonedas = await obtenerCriptomonedas(resultado.Data)
        selectCriptomonedas(criptomonedas) 
    } catch (error) {
        
    }
};

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach( criptomoneda => {
        const { FullName , Id , Name } = criptomoneda.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName
        criptomonedaSelect.appendChild(option)
    });
}

function leerValor(e){
    ObjBusqueda[e.target.name] = e.target.value
}

function submitFormulario(e){
    e.preventDefault();

    const { moneda, criptomoneda } = ObjBusqueda

    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('Ambos campos son obligatorios')
        return;
    }

    //Consultar la api con los resultados
    consultarAPI();
}

function mostrarAlerta(msg){
    const existeError = document.querySelector('.error')

    if(!existeError){
        const divMensaje = document.createElement('div')
        divMensaje.classList.add('error');
    
        //Mensaje de error
        divMensaje.textContent = msg;
    
        formulario.appendChild(divMensaje)
    
        setTimeout(() => {
            divMensaje.remove()
        }, 3000);
    }
}

async function consultarAPI(){
    const {moneda, criptomoneda} = ObjBusqueda;

    mostrarSpinner();

    const URL = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    try {
        const respuesta = await fetch(URL);
        const cotizacion = await respuesta.json();
        mostrarCotizacion(cotizacion.DISPLAY[criptomoneda][moneda])  
    } catch (error) {
        console.log(error);
    }
}

function mostrarCotizacion(cotizacion){
    limpiarHTML();

    const { CHANGE24HOUR, PRICE, HIGHDAY, LOWDAY, CHANGEPCT24HOUR, LASTUPDATE} = cotizacion

    const datos = document.createElement('div')
    datos.innerHTML = `
        <p class="precio">El precio es: <span>${PRICE}</span></p> 
        <p class="classGlobal">El precio más alto es: <span>${HIGHDAY}</span></p> 
        <p class="classGlobal">El precio más bajo es: <span>${LOWDAY}</span></p> 
        <p class="classGlobal">Variación últimas 24 horas: <span>${CHANGEPCT24HOUR}%</span></p> 
        <p class="classGlobal">Última actualización: <span>${LASTUPDATE}</span></p> 
        <p class="classGlobal">Cambio últimas 24 horas: <span>${CHANGE24HOUR}</span></p> 

    `;

    resultado.appendChild(datos);
}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const spinner = document.createElement('div')
    spinner.classList.add('sk-folding-cube')
    spinner.innerHTML = `
    <div class="sk-cube1 sk-cube"></div>
    <div class="sk-cube2 sk-cube"></div>
    <div class="sk-cube4 sk-cube"></div>
    <div class="sk-cube3 sk-cube"></div>
    `;

    resultado.appendChild(spinner);
}