import { useEffect } from "react";
import WithAuth from "../../seguranca/WithAuth";
import assets from "../../assets";

function Informacoes() {

    const paragraph = {
        fontSize: "22px",
        padding: "0 100px;",
    }

    const aStyle = {
        color: "rgb(80 117 173)",
        textDecoration: "none"
    }

    useEffect(() => {  
    }, []);

    return (
        <div style={{textAlign: 'center',}}>
            <img src={assets.images.logo_full_light} style={{ height: 'auto', width: '475px' }} alt={"Logo do Syphon.io"}/>
            <p style={paragraph}>
                Syphon.io é um projeto com o objetivo de experimentar com a implementação da plataforma de armazenamento 
                distribuído <a style={aStyle} href="https://ipfs.tech" target="_blank">IPFS</a> como alternativa para armazenamento em 
                nuvem pessoal, buscando trazer conveniência e simplicidade e eliminar o controle desregulado sobre os 
                dados pessoais dos usuários que plataformas centralizadas podem ter.
            </p>
            <p style={paragraph}>
                Para começar, na seção serviços você pode cadastrar <a style={aStyle} href="/servicos" target="_blank">serviços</a> de pinning, a funcionalidade de persistência de dados do 
                IPFS, podendo escolher entre os provedores <a style={aStyle} href="https://www.pinata.cloud" target="_blank">Piñata</a> e <a style={aStyle} href="https://filebase.com" target="_blank">Filebase</a>, 
                e em seguida, na seção <a style={aStyle} href="/" target="_blank">diretórios</a>, você pode montar uma estrutura de diretórios e subdiretórios, assim como realizar o upload de arquivos, que serão 
                criptografados e descriptografados utilizando uma chave privada que apenas você pode ver na seção de <a style={aStyle} href="/config" target="_blank">configurações</a>, onde você também poderá 
                alterar alguns dados de sua conta.
            </p>
        </div>
    )
}


export default WithAuth(Informacoes);