const Notifications = require("react-notifications");

const createNotification = (type:string, msg: string, titulo: string) => {
    console.log({a:type, b: msg, c: titulo})
    return () => {
        switch (type) {
        case 'info':
            Notifications.NotificationManager.info(msg, titulo ? titulo : "Informação");
            break;
        case 'success':case 'ok':
            Notifications.NotificationManager.success(msg, titulo ? titulo : "Sucesso!");
            break;
        case 'warning':case 'aviso':
            Notifications.NotificationManager.warning(msg, titulo ? titulo : "Aviso!", 3000);
            break;
        case 'error':case 'erro':
            Notifications.NotificationManager.error(msg, titulo ? titulo : "Erro!", 5000);
            break;
        }
    }
};

const notifications = {
    Notifications, createNotification
}

export default notifications;