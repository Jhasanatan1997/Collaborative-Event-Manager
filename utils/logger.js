const appLogger = async (
    type,
    user,
    funcName,
    status,
    message = ''
) => {
    const insertLog = {
        type: type || 'info',
        user: user || '',
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
