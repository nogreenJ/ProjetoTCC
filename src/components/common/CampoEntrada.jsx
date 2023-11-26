
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import InputGroup from 'react-bootstrap/InputGroup';
import { useState } from "react";

function CampoEntrada({ id, label, tipo, name, value, handlechange, width,
    requerido, readonly, textovalido, textoinvalido, maximocaracteres, classes, labelClasses }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="form-group" style={{ margin: '5px 0 5px 0' }}>
            <div class="row">
                <span class="col-md-12" style={{ display: 'flex' }}>
                    <label htmlFor={id} className={(labelClasses ? labelClasses : '') + " form-label col-md-2"}
                        style={{ justifyContent: 'right', display: 'flex', padding: '6px 6px 0 0' }}>
                        {label}
                    </label>
                    <span class={width ? width : "col-md-8"}>
                        {tipo === "password" ?
                            <InputGroup>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    className={(classes ? classes : '') + " form-control"}
                                    autoComplete="new-password"
                                    id={id}
                                    name={name}
                                    value={value}
                                    onChange={handlechange}
                                    required={requerido}
                                    readOnly={readonly}
                                    style={{ backgroundColor: readonly ? "lightgrey" : "white" }}
                                    maxLength={maximocaracteres} />
                                <button className="btn" title="Ver Senha" type="button"
                                    style={{ border: "1px solid #dee2e6", height: 38 }}
                                    onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? (
                                        <VisibilityIcon sx={{ fontSize: 20 }} />
                                    ) : (
                                        <VisibilityOffIcon sx={{ fontSize: 20 }} />
                                    )}
                                </button>
                            </InputGroup> :
                            <input
                                type={tipo}
                                className={(classes ? classes : '') + " form-control"}
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
                        }
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

export default CampoEntrada;