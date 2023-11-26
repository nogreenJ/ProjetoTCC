function CampoSelect(props) {

    return (
        <div className="form-group" style={{ margin: '5px 0 5px 0' }}>
            <div class="row">
                <span class="col-md-12" style={{ display: 'flex' }}>
                    <label htmlFor={props.id}
                        className={(props.labelClasses ? props.labelClasses : "") + " col-md-2 form-label"}
                        style={{ justifyContent: 'right', display: 'flex', padding: '6px 6px 0 0' }}>
                        {props.label}
                    </label>
                    <span class={props.width ? props.width : "col-md-8"}>
                        <select
                            className={(props.classes ? props.classes : "") + " form-select"}
                            id={props.id}
                            name={props.name}
                            value={props.value}
                            onChange={props.handlechange}
                            required={props.requerido}
                        >
                            {props.children}
                        </select>
                    </span>
                </span>
                <div className="valid-feedback">
                    {props.textovalido}
                </div>
                <div className="invalid-feedback">
                    {props.textoinvalido}
                </div>
            </div>
        </div>
    )

}

export default CampoSelect;