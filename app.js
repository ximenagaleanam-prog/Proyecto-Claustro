// --- 1. Conectar con los elementos del HTML ---
// --- CAMBIO AQUÍ: Añadimos los nuevos inputs ---
const btnAgregar = document.getElementById('btn-agregar');
const inputTitulo = document.getElementById('input-titulo'); // Renombrado de 'input-libro'
const inputAutor = document.getElementById('input-autor');
const inputIdioma = document.getElementById('input-idioma');
const tablero = document.getElementById('tablero');

// --- 2. Cargar libros guardados al iniciar ---
document.addEventListener('DOMContentLoaded', () => {
    cargarLibrosGuardados();
});

// --- 3. Escuchar el clic en el botón "Agregar" ---
btnAgregar.addEventListener('click', () => {
    // --- CAMBIO AQUÍ: Obtenemos los valores de los 3 campos ---
    const titulo = inputTitulo.value.trim();
    const autor = inputAutor.value.trim();
    const idioma = inputIdioma.value.trim();

    // El título sigue siendo el único campo obligatorio
    if (titulo) {
        // Pasamos los 3 valores a la función de búsqueda
        buscarLibro(titulo, autor, idioma);
        
        // --- CAMBIO AQUÍ: Limpiamos todos los campos ---
        inputTitulo.value = '';
        inputAutor.value = '';
        inputIdioma.value = '';
    } else {
        alert('Por favor, introduce al menos un título.');
    }
});

// --- 4. Función para buscar el libro en la API ---
// --- CAMBIO AQUÍ: La función ahora acepta autor e idioma ---
async function buscarLibro(titulo, autor, idioma) {
    try {
        // 1. Empezamos a construir la URL de la API
        const baseUrl = 'https://openlibrary.org/search.json?';
        
        // 2. --- CAMBIO AQUÍ: Construimos los parámetros de búsqueda ---
        // Usamos 'encodeURIComponent' para formatear correctamente los espacios y caracteres especiales
        let queryParams = `title=${encodeURIComponent(titulo)}`;
        
        if (autor) {
            queryParams += `&author=${encodeURIComponent(autor)}`;
        }
        if (idioma) {
            // La API de Open Library usa 'language' para el código de idioma
            queryParams += `&language=${encodeURIComponent(idioma)}`;
        }

        const urlCompleta = baseUrl + queryParams;
        console.log("Buscando en:", urlCompleta); // Para depurar y ver la URL que usamos

        // 3. Hacemos la llamada (fetch) a la API
        const respuesta = await fetch(urlCompleta);
        const datos = await respuesta.json();

        // 4. Verificamos si encontramos un libro y si tiene portada
        if (datos.docs.length > 0 && datos.docs[0].cover_i) {
            const coverId = datos.docs[0].cover_i;
            const urlPortada = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`;

            // 5. Añadimos y guardamos el libro
            agregarLibroAlTablero(urlPortada);
            guardarLibro(urlPortada);

        } else {
            alert('Libro no encontrado con esos criterios o sin portada.');
        }

    } catch (error) {
        console.error('Error al buscar el libro:', error);
    }
}

// --- 5. Función para añadir la imagen al tablero (SIN CAMBIOS) ---
function agregarLibroAlTablero(urlPortada) {
    const nuevaImagen = document.createElement('img');
    nuevaImagen.src = urlPortada;
    tablero.appendChild(nuevaImagen);
}

// --- 6. Funciones para guardar y cargar (LocalStorage) (SIN CAMBIOS) ---

function guardarLibro(urlPortada) {
    let libros = JSON.parse(localStorage.getItem('misLibros')) || [];
    libros.push(urlPortada);
    localStorage.setItem('misLibros', JSON.stringify(libros));
}

function cargarLibrosGuardados() {
    let libros = JSON.parse(localStorage.getItem('misLibros')) || [];
    libros.forEach(url => {
        agregarLibroAlTablero(url);
    });
}