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
    // Intentar enviar los datos al backend para crear o actualizar la actividad
    try { 
        // Determinar si se trata de una creación o actualización según la presencia del ID
        let res;

        // Si hay un ID, se trata de una actualización; de lo contrario, es una creación
        if (id) {
            // Actualizar
            res = await fetch(`${API_URL}/${id}`, {
                // Enviar la solicitud PUT con los datos actualizados
                method: 'PUT',
                // Establecer el tipo de contenido como JSON
                headers: { 'Content-Type': 'application/json' },
                // Convertir los datos a JSON para enviarlos en el cuerpo de la solicitud
                body: JSON.stringify({ nombre, materia, estado_id, prioridad_id })
            });
        } else {
            // Crear
            res = await fetch(API_URL, {
                // Enviar la solicitud POST con los datos de la nueva actividad
                method: 'POST',
                // Establecer el tipo de contenido como JSON
                headers: { 'Content-Type': 'application/json' },
                // Convertir los datos a JSON para enviarlos en el cuerpo de la solicitud
                body: JSON.stringify({ nombre, materia, prioridad_id })
            });
        }

        /* Manejar la respuesta de la API */
        const data = await res.json();
        // Si la respuesta no es exitosa, lanzar un error con el mensaje recibido o un mensaje genérico
        if (!res.ok) throw new Error(data.mensaje || 'Error al guardar en la base de datos');

        /* Resetear el formulario y recargar la lista de actividades */
        resetearFormulario();
        // Recargar las actividades para reflejar los cambios
        cargarActividades();
    } catch (error) {
        // Mostrar el error en la consola y en el mensaje de alerta del formulario
        console.error(error);
        // Mostrar el mensaje de error en el elemento de alerta del formulario
        mensajeAlerta.textContent = error.message;
    }
});

/* Función para cambiar el estado de una actividad */
async function cambiarEstado(id, nuevoEstadoId) {
    try {
        // Llamada a la API para actualizar el estado de la actividad
        await fetch(`${API_URL}/${id}/estado`, {
            // Enviar la solicitud PATCH con el nuevo estado
            method: 'PATCH',
            // Establecer el tipo de contenido como JSON
            headers: { 'Content-Type': 'application/json' },
            // Convertir el nuevo estado a JSON para enviarlo en el cuerpo de la solicitud
            body: JSON.stringify({ estado_id: parseInt(nuevoEstadoId) })
        });
        // Recargar las actividades para reflejar el cambio de estado
        cargarActividades();
    } catch (error) {
        // Mostrar el error en la consola si ocurre un problema al cambiar el estado
        console.error('Error al cambiar estado:', error);
    }
}

/* Función para preparar el formulario para la edición de una actividad */
function prepararEdicion(actividad) {
    // Rellenar el formulario con los datos de la actividad seleccionada
    document.getElementById('actividadId').value = actividad.pkid_actividad;
    // Rellenar los campos del formulario con los valores de la actividad
    document.getElementById('nombre').value = actividad.vch_nombre;
    // Rellenar los campos del formulario con los valores de la actividad
    document.getElementById('materia').value = actividad.vch_materia;
    // Rellenar los campos del formulario con los valores de la actividad
    document.getElementById('prioridad').value = actividad.int_prioridad_id;
    // Rellenar los campos del formulario con los valores de la actividad
    document.getElementById('estado').value = actividad.int_estado_id;
    /* Cambiar el título del formulario y mostrar el botón de cancelar */
    tituloFormulario.textContent = 'MODIFICAR ACTIVIDAD';
    // Cambiar el texto del botón de guardar para reflejar que se trata de una modificación
    btnGuardar.textContent = 'GUARDAR CAMBIOS';
    // Mostrar el contenedor del campo de estado y el botón de cancelar para permitir la edición
    campoEstadoContainer.style.display = 'block';
    // Mostrar el botón de cancelar para permitir al usuario volver al estado inicial del formulario
    btnCancelar.style.display = 'inline-block';
}

/* Función para eliminar una actividad */
async function eliminarActividad(id) {
    // Confirmar con el usuario antes de eliminar la actividad
    if (!confirm('¿Estás seguro de eliminar esta actividad?')) return;

    /* Llamada a la API para eliminar la actividad */
    try {
        // Enviar la solicitud DELETE a la API para eliminar la actividad con el ID especificado
        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        // Recargar las actividades para reflejar la eliminación
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
    // Cambiar el título del formulario y el texto del botón de guardar para reflejar que se trata de un registro
    tituloFormulario.textContent = 'REGISTRAR ACTIVIDAD';
    // Cambiar el texto del botón de guardar para reflejar que se trata de un registro
    btnGuardar.textContent = 'REGISTRAR';
    // Ocultar el contenedor del campo de estado y el botón de cancelar para volver al estado inicial del formulario
    campoEstadoContainer.style.display = 'none';
    // Ocultar el botón de cancelar y limpiar el mensaje de alerta
    btnCancelar.style.display = 'none';
    // Limpiar el mensaje de alerta para que no quede ningún mensaje residual al resetear el formulario
    mensajeAlerta.textContent = '';
}