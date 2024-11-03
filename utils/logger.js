const appLogger = async (
    type,
    email,
    funcName,
    status,
    message = ''
) => {
    const insertLog = {
        type: type || 'info',
        user: email || '',
        functionName: funcName,
        status: status || '',
        message: JSON.stringify(message),
    };

    // creating logs.
    setTimeout(() => {
        console.log(insertLog);
    }, 0);
};

module.exports = {
    appLogger,
};
