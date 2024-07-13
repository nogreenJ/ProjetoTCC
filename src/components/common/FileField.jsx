import { useState, useCallback } from "react";
import { useDropzone } from 'react-dropzone'
import crypto from "../../crypto"
import { getUserKey } from "../../seguranca/Autenticacao";

function FileField({ id, name, width, requerido, textovalido, textoinvalido, onChange, handlechange }) {

    const userKey = getUserKey();

    const [activeFile, setActiveFile] = useState({ nome: '', binary: '', formato: '' });

    const onDrop = useCallback(acceptedFiles => {
        setActiveFile(acceptedFiles[0])
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('upload de arquivo abortado')
            reader.onerror = () => console.log('erro no upload de arquivo')
            reader.onload = () => {
                const binaryStr = reader.result
                /*setActiveFile({
                    nome: file.name.split('.')[0], binary: binaryStr,
                    formato: ('.' + file.name.split('.')[1])
                });*/
                if (onChange) onChange(file, binaryStr)
            }
            reader.readAsArrayBuffer(file)
        })
    }, []);

    const clearFile = () =>{
        setActiveFile({});
    }

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    return (
        <div className="form-group" style={{ margin: '5px 0 5px 0' }}>
            <div className="row">
                <span className="col-md-12" style={{ display: 'flex' }}>
                    <div className="col-md-2"></div>
                    <span className={width ? width : "col-md-8 "} {...getRootProps()}>
                        <input type="text"
                            className="dropFiles" {...getInputProps()}
                            id={id} name={name} required={requerido}
                            style={{ backgroundColor: "white" }} />
                    </span>
                </span>
                <div className="valid-feedback">
                    {textovalido}
                </div>
                <div className="invalid-feedback">
                    {textoinvalido}
                </div>
            </div>
        </div>
    )

}

export default FileField;