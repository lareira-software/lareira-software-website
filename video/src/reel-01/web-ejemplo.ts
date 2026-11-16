import foto from '../../../img/o-forno.jpg';
import type {WebEjemplo} from '../comun/Movil';

// Negocio inventado, el mismo que la web de ejemplo de lareirasoftware.com
export const O_FORNO: WebEjemplo = {nombre: 'O Forno', lugar: 'Panadería · Corcubión', foto, texto: 'Pan de leña cada mañana', boton: 'Reservar'};

// Posiciones del móvil compartidas entre las escenas 2 y 3 (centro de la base, en px)
export const MOVIL_ESC2 = {bx: 420, by: 1390, escalaIni: 1, escalaFin: 1.04};
export const MOVIL_PUNTA = {bx: 540, by: 1160, escala: 0.4};
export const LINEA_AGUA = 1180;
