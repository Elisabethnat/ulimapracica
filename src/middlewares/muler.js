import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

// Convertir la URL del archivo actual a una ruta de sistema de archivos
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Definir la configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const fileType = req.params.fileType; // Obtener el tipo de archivo desde la URL
        let uploadPath = '';

        // Determinar la carpeta de destino según el tipo de archivo
        if (fileType === 'profile') {
            uploadPath = 'uploads/profiles/';
        } else if (fileType === 'product') {
            uploadPath = 'uploads/products/';
        } else if (fileType === 'document') {
            uploadPath = 'uploads/documents/';
        }

        // Crear la carpeta si no existe
        const fullPath = path.join(__dirname, '..', uploadPath);
        cb(null, fullPath);
    },
    filename: function (req, file, cb) {
        // Asignar un nombre de archivo único
        cb(null, Date.now() + '-' + file.originalname);
    },
});

const upload = multer({ storage: storage });

export default upload;
