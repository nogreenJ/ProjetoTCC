import Button from '@mui/material/Button';

function Dialogo(props) {

    // Example starter JavaScript for disabling form submissions if there are invalid fields
    (() => {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        const forms = document.querySelectorAll('.needs-validation')

        // Loop over them and prevent submission
        Array.from(forms).forEach(form => {
            form.addEventListener('submit', event => {
                if (!form.checkValidity()) {
                    event.preventDefault()
                    event.stopPropagation()
                }

                form.classList.add('was-validated')
            }, false)
        })
    })()

    return (
        <div className="modal fade modal-lg" id={props.id} tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true" style={{ marginTop: 128 }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{props.titulo}</h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <form id={props.idformulario} onSubmit={props.acaoCadastrar}
                        className="needs-validation" noValidate>
                        <div className="modal-body">
                            <div className="container">
                                {props.children}
                            </div>
                        </div>
                        <div className="modal-footer" style={{ textAlign: 'center', display: 'block' }}>
                            <Button type="submit" className="w-25 btn btn-lg btn-outline-primary text-primary" data-bs-dismiss="modal">
                                Salvar
                            </Button>
                            <Button type="button" className="w-25 btn btn-lg btn-outline-danger text-danger" data-bs-dismiss="modal">
                                Fechar
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Dialogo;