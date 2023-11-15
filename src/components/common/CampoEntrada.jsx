function CampoEntrada({ id, label, tipo, name, value, handlechange,
    requerido, readonly, textovalido, textoinvalido, maximocaracteres, classes, labelClasses }) {

    return (
        <div className="form-group" style={{ margin: '5px 0 5px 0' }}>
            <span style={{ display: 'flex' }}>
                <label htmlFor={id} className={labelClasses + " form-label"} style={{ justifyContent: 'right', display: 'flex', padding: '6px 6px 0 0', width: '10%' }}>
                    {label}
                </label>
                <input
                    type={tipo}
                    className={classes + " form-control"}
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
            </span>
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