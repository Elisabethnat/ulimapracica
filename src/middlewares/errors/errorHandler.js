import EErrors from "../../services/errors/enums.js";

export default (error, req, res, next) => {
    console.log(error.cause);
    switch (error.code) {
        case EErrors.ROUTING_ERROR:
        res.send({ status: "Error en rutas ", error: error.name });
            break;
        case EErrors.CONTROLLER_ERROR:
        res.send.status(500).send({ status: "Error en controladores", error: error.name });
            break;
        case EErrors.DATOS_INVALIDOS_ERROR:
        res.send.status(400).send({ status: "Error en ingreso de datos", error: error.name });
            break;
        case EErrors.DATABASE_ERROR:
        res.status(500).send({ status: "Error en base de datos", error: error.name });
            break;
        default:
            res.send({ status: "error", error: "Unhandled error" });
    };
};