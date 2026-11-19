/* URL de la API */
const API_URL = 'http://localhost:3000/api/actividades';

/* Elementos del DOM */
const form = document.getElementById('formActividad');
const cuerpoTabla = document.getElementById('cuerpoTabla');
const mensajeAlerta = document.getElementById('mensajeAlerta');
const tituloFormulario = document.getElementById('tituloFormulario');
const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');
const campoEstadoContainer = document.getElementById('campoEstadoContainer');

document.addEventListener('DOMContentLoaded', cargarActividades);

/* Función para cargar las actividades desde el backend */
async function cargarActividades() {
    try {
        /* Llamada a la API para obtener las actividades */
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('No se pudo conectar con el servidor backend');
        const actividades = await res.json();
        renderizarTabla(actividades);
    } catch (error) {
        console.error('Error cargando actividades:', error);
        mensajeAlerta.textContent = 'Error: Asegúrate de que el servidor en Node.js esté encendido.';
    }
}

/* Función para renderizar la tabla de actividades */
function renderizarTabla(actividades) {
    cuerpoTabla.innerHTML = '';
/* Mostrar un mensaje si no hay actividades */
    if (actividades.length === 0) {
        cuerpoTabla.innerHTML = `<tr><td colspan="5" style="text-align: center; color: #64748b;">No hay actividades registradas.</td></tr>`;
        return;
    }

    actividades.forEach(act => {
        /* Crear una fila para cada actividad */
        const tr = document.createElement('tr');
        /* Rellenar la fila con los datos de la actividad */
        tr.innerHTML = `
            <td>${act.vch_nombre}</td>
            <td>${act.vch_materia}</td>
            <td><strong>${act.prioridad}</strong></td>
            <td>${act.estado}</td>
            
            <td>
                <button class="btn-accion btn-editar" onclick='prepararEdicion(${JSON.stringify(act)})'>Editar</button>
                <button class="btn-accion btn-eliminar" onclick="eliminarActividad(${act.pkid_actividad})">Eliminar</button>
            </td>
        `;
        cuerpoTabla.appendChild(tr);
    });
}

/* Evento para el envío del formulario */
form.addEventListener('submit', async (e) => {
    e.preventDefault();
    mensajeAlerta.textContent = '';

    /* Obtener los valores del formulario */
    const id = document.getElementById('actividadId').value;
    const nombre = document.getElementById('nombre').value.trim();
    const materia = document.getElementById('materia').value.trim();
    const prioridad_id = parseInt(document.getElementById('prioridad').value);
    const estado_id = parseInt(document.getElementById('estado').value);

    /* Validación de campos obligatorios */
    if (!nombre || !materia) {
        mensajeAlerta.textContent = 'Por favor, completa todos los campos.';
        return;
    }

    try {
        let res;
        if (id) {
            // Actualizar
            res = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, materia, estado_id, prioridad_id })
            });
        } else {
            // Crear
            res = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, materia, prioridad_id })
            });
        }

        /* Manejar la respuesta de la API */
        const data = await res.json();
        if (!res.ok) throw new Error(data.mensaje || 'Error al guardar en la base de datos');

        /* Resetear el formulario y recargar la lista de actividades */
        resetearFormulario();
        cargarActividades();
    } catch (error) {
        console.error(error);
        mensajeAlerta.textContent = error.message;
    }
});

/* Función para cambiar el estado de una actividad */
async function cambiarEstado(id, nuevoEstadoId) {
    try {
        await fetch(`${API_URL}/${id}/estado`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado_id: parseInt(nuevoEstadoId) })
        });
        cargarActividades();
    } catch (error) {
        console.error('Error al cambiar estado:', error);
    }
}

/* Función para preparar el formulario para la edición de una actividad */
function prepararEdicion(actividad) {
    document.getElementById('actividadId').value = actividad.pkid_actividad;
    document.getElementById('nombre').value = actividad.vch_nombre;
    document.getElementById('materia').value = actividad.vch_materia;
    document.getElementById('prioridad').value = actividad.int_prioridad_id;
    document.getElementById('estado').value = actividad.int_estado_id;
    /* Cambiar el título del formulario y mostrar el botón de cancelar */
    tituloFormulario.textContent = 'MODIFICAR ACTIVIDAD';
    btnGuardar.textContent = 'GUARDAR CAMBIOS';
    campoEstadoContainer.style.display = 'block';
    btnCancelar.style.display = 'inline-block';
}

/* Función para eliminar una actividad */
async function eliminarActividad(id) {
    if (!confirm('¿Estás seguro de eliminar esta actividad?')) return;

    /* Llamada a la API para eliminar la actividad */
    try {
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        cargarActividades();
    } catch (error) {
        console.error('Error al eliminar:', error);
    }
}
/* Evento para el botón de cancelar */
btnCancelar.addEventListener('click', resetearFormulario);

/* Función para resetear el formulario y volver al estado inicial */
function resetearFormulario() {

    /* Limpiar el formulario y volver al estado inicial */
    form.reset();

    /* Limpiar el campo oculto de ID y cambiar el título del formulario */
    document.getElementById('actividadId').value = '';
    tituloFormulario.textContent = 'REGISTRAR ACTIVIDAD';
    btnGuardar.textContent = 'REGISTRAR';
    campoEstadoContainer.style.display = 'none';
    btnCancelar.style.display = 'none';
    mensajeAlerta.textContent = '';
}