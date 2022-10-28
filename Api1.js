import { html, css, LitElement } from 'lit';

export class Api1 extends LitElement {
  static get styles() {
    return css`
      :host {
        display: block;
        padding: 25px;
        color: var(--api-1-text-color, #000);
      }
//creacion de mi tabla
table, td {
  border: 1px solid;
  border-collapse: collapse;
  text-align: center;
}

tr:hover {
  background-color: wheat;
  
}

td {
  width: 200px;
}

form {
  background-color: cyan;
  border-radius: 10px;
  margin-bottom: 10px;
  padding: 10px;
  text-align: center;
}

form > input {
  width: 500px;
}
    `;
  }

  static get properties() {
    return {
      estaciones: {type: Array},
      _listStationTemp: {type: Array},
      value: {type: String},
      _url: {type: String} 
    };
  }

  constructor() {
    super();
    this.estaciones = [];
    this._listStationTemp = [];
    this.value = '' ;
    this._url = 'https://api.datos.gob.mx/v1/calidadAire/';
    //solicitud a la api

    this.getApiGob().then((data) => {
      let res = data.results;
      //acceder a valores de las keys y devolverlos en un arreglo

      this.estaciones = Object.keys(res).map((key) => res[key].stations);
      //crear copia de las estaciones con peticion hecha
      this._listStationTemp = this.estaciones;
    })
  }

  async getApiGob(){
const resp = await fetch(this._url);
//peticion a api de manera asincrona
return await resp.json();
//retornar json
  }
  _handleKey(event) {
		this.value = event.target.value; // Para 'guardar' los caracteres que se escriben en el input
		// Si el input está vacío sigue mostrando el arreglo original (this.estaciones)
		if (this.value.length === 0) this._listStationTemp = this.estaciones;
		
		// Se filtran los elementos que coincidan con los caracteres del nombre de la estacion 
		// que se ingresa en el input
		this._listStationTemp = this.estaciones.filter((station) => station[0].name.includes(this.value));
	}

  render() {

    return html`
    
    <form>
      <label for="busqueda"> filter: </label>
      <input type="search" @input="${this._handleKey}" name="busqueda" placeholder="busqueda" placeholder="Buscar por nombre"/>
      </form>

      <table>
        <body>
          ${this._listStationTemp.map(
            (estacion) => html`

            <tr>
              <td>${estacion[0].id}</td>
              <td>${estacion[0].name}</td>
              <td>${estacion[0].indexes[0].calculationTime}</td>
              <td>${estacion[0].indexes[0].scale}</td>
              <td>${estacion[0].location.lon}</td>
              <td>${estacion[0].location.lat}</td>
</tr>
`

          )}
          </tbody>
          </table>
`;
          }
        }
