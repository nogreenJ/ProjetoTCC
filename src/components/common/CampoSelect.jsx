function CampoSelect(props) {

    return (
        <div className="form-group">
            <span style={{ display: 'flex' }}>
                <label htmlFor={props.id} className={props.labelClasses + " form-label"}
                    style={{ justifyContent: 'right', display: 'flex', padding: '6px 6px 0 0', width: '10%' }}>
                    {props.label}
                </label>
                <select
                    className={props.classes + " form-select"}
                    id={props.id}
                    name={props.name}
                    value={props.value}
                    onChange={props.handlechange}
                    required={props.requerido}
                >
                    {props.children}
                </select>
            </span>
            <div className="valid-feedback">
                {props.textovalido}
            </div>
            <div className="invalid-feedback">
                {props.textoinvalido}
            </div>
        </div>
    )

}

export default CampoSelect;