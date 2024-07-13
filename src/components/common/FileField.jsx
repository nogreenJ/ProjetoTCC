import { useCallback, useState } from "react";
import { useDropzone } from 'react-dropzone'
import 'font-awesome/css/font-awesome.min.css';

function FileField({ id, name, width, requerido, textovalido, textoinvalido, onChange }) {

    const style = {
        textAlign: "center",
        padding: "20px",
        border: "2px lightgrey dashed",
        backgroundColor: "white"
    }
     
    const btnStyle = {
        textAlign: "center",
        backgroundColor: "white",
        borderRadius: "6px",
        color: "#ff00008f",
        padding: "5px",
        paddingTop: "1px",
        border: "2px #ff0000b8 solid",
        height: "30px"
    }
    
  const [myFiles, setMyFiles] = useState([]);

    const onDrop = useCallback(acceptedFiles => {
        setMyFiles([...myFiles, ...acceptedFiles]);
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()

            reader.onabort = () => console.log('upload de arquivo abortado')
            reader.onerror = () => console.log('erro no upload de arquivo')
            reader.onload = () => {
                const binaryStr = reader.result
                if (onChange) onChange(file, binaryStr);
            }
            reader.readAsArrayBuffer(file)
        })
    }, []);

    const { getRootProps, getInputProps, acceptedFiles } = useDropzone({ 
        noKeyboard: true,
        maxSize: 20971520,
        multiple: false,
        onDrop 
    });

    const removeFile = (e) => {
        e.preventDefault();
        const newFiles = [...myFiles];
        newFiles.splice(0, 1);
        setMyFiles([]);
        acceptedFiles.splice(0, 1);
        onChange(null);
    }

    return (
        <div className="form-group" style={{ margin: '5px 0 5px 0' }}>
            <div className="row">
                <span className="col-md-12" style={{ display: 'flex' }}>
                    <div className="col-md-2"></div>
                    <span className={width ? width : "col-md-6 "} {...getRootProps()}>
                        <input {...getInputProps()}
                            id={id} name={name} required={requerido}
                            style={style} />
                    </span>
                    {!!acceptedFiles.length && <button onClick={removeFile} style={btnStyle}>
                        <i className="fa fa-trash"></i>
                    </button>}
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