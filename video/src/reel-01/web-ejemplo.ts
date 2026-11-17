import {asset} from '../comun/assets';
import fotoAntigua from '../../../img/o-forno.jpg';
import type {WebEjemplo} from '../comun/Movil';

// Negocio inventado, el mismo que la web de ejemplo de lareirasoftware.com.
// La foto es la del gancho: assets/lareira.jpg si existe; si no, el horno dibujado (assets/o-forno.jpg, `npm run foto`).
export const fotoOForno = () => asset('lareira.jpg') ?? asset('o-forno.jpg') ?? fotoAntigua;
export const O_FORNO: Omit<WebEjemplo, 'foto'> = {nombre: 'O Forno', lugar: 'Panadería · Corcubión', texto: 'Pan de leña cada mañana', boton: 'Reservar'};

// Posiciones del móvil compartidas entre las escenas 2 y 3 (centro de la base, en px)
export const MOVIL_ESC2 = {bx: 420, by: 1390, escalaIni: 1, escalaFin: 1.04};
export const MOVIL_PUNTA = {bx: 540, by: 1160, escala: 0.4};
export const LINEA_AGUA = 1180;
