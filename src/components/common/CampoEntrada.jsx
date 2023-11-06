function CampoEntrada({ id, label, tipo, name, value, handlechange,
    requerido, readonly, textovalido, textoinvalido, maximocaracteres }) {

    return (
        <div className="form-group">
            <label htmlFor={id} className="form-label">
                {label}
            </label>
            <input
                type={tipo}
                className="form-control"
                autoComplete="new-password"
                id={id}
                name={name}
                value={value}
                onChange={handlechange}
                required={requerido}
                readOnly={readonly}
                style={{ backgroundColor: readonly ? "lightgrey" : "white" }}
                maxLength={maximocaracteres}
            />
            <div className="valid-feedback">
                {textovalido}
            </div>
            <div className="invalid-feedback">
                {textoinvalido}
            </div>
        </div>
    )

}

export default CampoEntrada;