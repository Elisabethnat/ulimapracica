import { logger } from "../utils/logger.js";

const getLog = (req, res) => {
    logger.info('mi primer log');
    try {
        logger.warning('Estamos entrendo en la prubea de error');
        throw new Error ('test error');
    } catch (error) {
        logger.error(`[ERROR] ${new Date().toLocaleDateString()} - ${new Date().toLocaleTimeString()}Ha ocurrido un error ${error.message}`);
        res.status(500).json({message: 'Internal server error'});
    };
    // Esta línea no se ejecutará si se lanza un error
    // res.status(200).send('GET request to the main');
};

const postLog = (req, res)=> {
    res.status(201).send('POST request to the main');
};

const loggerControllers = {
    getLog,
    postLog
};

export default loggerControllers;