import { useState, useEffect } from "react";

const Alerta = ({ alerta }) => {

    const [exibir, setExibir] = useState(false);

    useEffect(() => {
        setExibir(true);
        setTimeout(() => {
            setExibir(false);
        }, 10000);
    }, [alerta]);

    let classe = '';
    if (alerta.status === 'error') {
        classe = 'alert alert-danger'
    } else {
        classe = 'alert alert-primary';
    }

    return (
        <>
            {
                (alerta.message && alerta.message.length && exibir) &&
                <div className={classe} role="alert">
                    {alerta.message}
                </div>
            }
        </>
    )

}

export default Alerta;