import { useContext } from 'react'
import Alerta from '../../components/common/Alerta';
import DiretorioContext from './DiretorioContext';
import CampoEntrada from '../../components/common/CampoEntrada';
import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
import Fade from '@mui/material/Fade';
import CampoSelect from '../../components/common/CampoSelect';
import Button from '@mui/material/Button';
import * as React from 'react';
import Dialogo from '../../components/common/Dialogo';
import CreateNewFolderOutlinedIcon from '@mui/icons-material/CreateNewFolderOutlined';
import 'bootstrap/dist/css/bootstrap.min.css'
import '@popperjs/core/dist/cjs/popper.js'
import 'bootstrap/dist/js/bootstrap.min.js'


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

export default function Form({ parent }) {

    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const { objeto, handleChange, acaoCadastrar, alerta, getListaObjetosSemSelf } = useContext(DiretorioContext);

    parent = parent ? parent : (objeto ? objeto.parent : "");

    return (
        <div style={{ marginLeft: '-20px' }}>
            <Button onClick={handleOpen}><CreateNewFolderOutlinedIcon /></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                closeAfterTransition
            >
                <Fade in={open}>
                    <Box sx={style}>
                        <Dialogo id="modalEdicao" titulo="Diretorio" idformulario="formEdicao"
                            acaoCadastrar={acaoCadastrar}>
                            <Alerta alerta={alerta} />
                            <CampoEntrada id="txtCodigo" label="Código" tipo="number"
                                name="codigo" value={objeto ? objeto.codigo : 0}
                                handlechange={handleChange}
                                requerido={false} readonly={true}
                                maximocaracteres={5} />
                            <CampoEntrada id="txtNome" label="Nome" tipo="text"
                                name="nome" value={objeto ? objeto.nome : ''}
                                handlechange={handleChange}
                                requerido={true} readonly={false}
                                textovalido="Nome OK" textoinvalido="Informe o nome"
                                maximocaracteres={40} />
                            <CampoSelect id="txtParent" label="Dir. Pai"
                                name="parent" value={parent}
                                handlechange={handleChange}
                                requerido={false}
                                textovalido="Dir. Pai OK">
                                <option key="" value="">
                                    Sem Dir. Pai
                                </option>
                                {

                                    getListaObjetosSemSelf().map((cat) => (
                                        <option key={cat.codigo} value={cat.codigo}>
                                            {cat.nome}
                                        </option>
                                    ))
                                }
                            </CampoSelect>
                        </Dialogo>
                    </Box>
                </Fade>
            </Modal>
        </div>
    )
}
