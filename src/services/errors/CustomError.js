//genero un metodo estatico para generar un nuevo error
export default class CustomError {
    static createError({name="Error",cause,message,code=1}){
        const error = new Error(message, {cause});
        error.name=name;
        error.cause=cause;
        error.code=code;
        return error;
    };
};