import * as JsEncryptModule from 'jsencrypt';
import * as RS from 'jsrsasign';
import * as RSU from 'jsrsasign-util';
import * as CryptoJS from 'crypto-js';

import {history} from "../../_helpers/history";
export const bouceToStep =(appCurrentScreen)=>{

}


export const encryptAnItem = (itemToEncrypt)=>{
    if(itemToEncrypt!=="" && itemToEncrypt!==null && itemToEncrypt!==undefined){
        let encryptItem = new JsEncryptModule.JSEncrypt();

        let publicEncryptKey = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoQh0wEqx/R2H1v00IU12
    Oc30fosRC/frhH89L6G+fzeaqI19MYQhEPMU13wpeqRONCUta+2iC1sgCNQ9qGGf
    19yGdZUfueaB1Nu9rdueQKXgVurGHJ+5N71UFm+OP1XcnFUCK4wT5d7ZIifXxuqL
    ehP9Ts6sNjhVfa+yU+VjF5HoIe69OJEPo7OxRZcRTe17khc93Ic+PfyqswQJJlY/
    bgpcLJQnM+QuHmxNtF7/FpAx9YEQsShsGpVo7JaKgLo+s6AFoJ4QldQKir2vbN9v
    cKRbG3piElPilWDpjXQkOJZhUloh/jd7QrKFimZFldJ1r6Q59QYUyGKZARUe0KZp
    MQIDAQAB
    -----END PUBLIC KEY-----
        `

        let privateEncryptKey = `-----BEGIN RSA PRIVATE KEY-----
        MIICWwIBAAKBgFS8jJxu7l9giCZxi5D9kHH1XOWTLT//2TH/9lPSazbmW4+sL15G
        COI0272rxn92RZUCFA1cWysSulE+OihOz5b0THSZPcV/UuTUCJFssTw9oPOzOcR7
        RM2SpFISbw0aSeAzuUZ3OmDGs9GZ6G21qkHnVxigSZqFKoLrERlsIS5hAgMBAAEC
        gYASFaeg32AKhQypv8P8rtE8MRShfpbCuPT+4dUNsLPnJKTX9fSqFyJgPM3FHjsg
        CvrwwV/MNjDS8Y1IN5Kr9Z4CJ8OStH39g8rOJq31zRKMQvQWwPOGrhtlBtawF2h1
        Zyxjpa6DAiJxSOB0NH0OgAcANEmtI+J/ooYSnItDabhQjQJBAJV1h+zi0Vcw52sq
        kXmztgcLwIzMzgQmFsfr0arbWkVg6pQQrF/yeDMW9yCnEeRw4fkBb7KyKl0N8nGh
        jnau89cCQQCRI+8IeniLU92lQ5uO55wcxQMIExprJg0MXATuyYxwd/GKdg41tcWh
        gl4uVmgwOWzm/1YieYWgF1h5nvv1wyiHAkATRT4rWutm9JVCChELwhIcQnWnMdj2
        S/rv+AXmo7W18FMOmD/Bdz/sRm/CtAfojm10b6z5O2Oe7+dso0n9H32tAkEAhSFi
        1nIQNCy/OCIlhBVqmvETcMqlBvemLFoTpDx3d4ptokXbjuSm3RjJ7tMPSnzCKbi4
        d3LkYQ5I93YfQzS57QJAWXV+JdLdHyAMZpWvwsgrLBc0rkHBsHfiNC+/lOBIBKG1
        m90l5+siuhQaYLuDHbVN4BWGzP6hv5+OOzvhIlOTWQ==
        -----END RSA PRIVATE KEY-----`

        encryptItem.setPublicKey(publicEncryptKey);
        let encryptedItem = encryptItem.encrypt(itemToEncrypt);
        return encryptedItem;
    }
    return null;
    
}

export const createTransactionSigner = (itemToSign)=>{
    // if(itemToEncrypt!=="" && itemToEncrypt!==null && itemToEncrypt!==undefined){
        let encryptItem = new JsEncryptModule.JSEncrypt();

        let publicEncryptKey = `-----BEGIN PUBLIC KEY-----
    MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoQh0wEqx/R2H1v00IU12
    Oc30fosRC/frhH89L6G+fzeaqI19MYQhEPMU13wpeqRONCUta+2iC1sgCNQ9qGGf
    19yGdZUfueaB1Nu9rdueQKXgVurGHJ+5N71UFm+OP1XcnFUCK4wT5d7ZIifXxuqL
    ehP9Ts6sNjhVfa+yU+VjF5HoIe69OJEPo7OxRZcRTe17khc93Ic+PfyqswQJJlY/
    bgpcLJQnM+QuHmxNtF7/FpAx9YEQsShsGpVo7JaKgLo+s6AFoJ4QldQKir2vbN9v
    cKRbG3piElPilWDpjXQkOJZhUloh/jd7QrKFimZFldJ1r6Q59QYUyGKZARUe0KZp
    MQIDAQAB
    -----END PUBLIC KEY-----
        `

        let privateEncryptKey = `-----BEGIN RSA PRIVATE KEY-----
        MIICWwIBAAKBgFS8jJxu7l9giCZxi5D9kHH1XOWTLT//2TH/9lPSazbmW4+sL15G
        COI0272rxn92RZUCFA1cWysSulE+OihOz5b0THSZPcV/UuTUCJFssTw9oPOzOcR7
        RM2SpFISbw0aSeAzuUZ3OmDGs9GZ6G21qkHnVxigSZqFKoLrERlsIS5hAgMBAAEC
        gYASFaeg32AKhQypv8P8rtE8MRShfpbCuPT+4dUNsLPnJKTX9fSqFyJgPM3FHjsg
        CvrwwV/MNjDS8Y1IN5Kr9Z4CJ8OStH39g8rOJq31zRKMQvQWwPOGrhtlBtawF2h1
        Zyxjpa6DAiJxSOB0NH0OgAcANEmtI+J/ooYSnItDabhQjQJBAJV1h+zi0Vcw52sq
        kXmztgcLwIzMzgQmFsfr0arbWkVg6pQQrF/yeDMW9yCnEeRw4fkBb7KyKl0N8nGh
        jnau89cCQQCRI+8IeniLU92lQ5uO55wcxQMIExprJg0MXATuyYxwd/GKdg41tcWh
        gl4uVmgwOWzm/1YieYWgF1h5nvv1wyiHAkATRT4rWutm9JVCChELwhIcQnWnMdj2
        S/rv+AXmo7W18FMOmD/Bdz/sRm/CtAfojm10b6z5O2Oe7+dso0n9H32tAkEAhSFi
        1nIQNCy/OCIlhBVqmvETcMqlBvemLFoTpDx3d4ptokXbjuSm3RjJ7tMPSnzCKbi4
        d3LkYQ5I93YfQzS57QJAWXV+JdLdHyAMZpWvwsgrLBc0rkHBsHfiNC+/lOBIBKG1
        m90l5+siuhQaYLuDHbVN4BWGzP6hv5+OOzvhIlOTWQ==
        -----END RSA PRIVATE KEY-----`
        
        // encryptItem.setPublicKey(publicEncryptKey);
        encryptItem.setPrivateKey(privateEncryptKey);
        // let signedItem =  encryptItem.sign('07768232323|30998027392|382973|20.00', CryptoJS.SHA256, "sha256");
        let signedItem =  encryptItem.sign(itemToSign, CryptoJS.SHA256, "sha256");
        
        // let encryptedItem = encryptItem.key.parseKey();
        return signedItem;
    // }
    // return null;
    
}

// export const createTransactionSigner2 = (itemToEncrypt)=>{
//     // if(itemToEncrypt!=="" && itemToEncrypt!==null && itemToEncrypt!==undefined){
//         // let encryptItem = new JsEncryptModule.JSEncrypt();

//         let publicEncryptKey = `-----BEGIN PUBLIC KEY-----
//     MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAoQh0wEqx/R2H1v00IU12
//     Oc30fosRC/frhH89L6G+fzeaqI19MYQhEPMU13wpeqRONCUta+2iC1sgCNQ9qGGf
//     19yGdZUfueaB1Nu9rdueQKXgVurGHJ+5N71UFm+OP1XcnFUCK4wT5d7ZIifXxuqL
//     ehP9Ts6sNjhVfa+yU+VjF5HoIe69OJEPo7OxRZcRTe17khc93Ic+PfyqswQJJlY/
//     bgpcLJQnM+QuHmxNtF7/FpAx9YEQsShsGpVo7JaKgLo+s6AFoJ4QldQKir2vbN9v
//     cKRbG3piElPilWDpjXQkOJZhUloh/jd7QrKFimZFldJ1r6Q59QYUyGKZARUe0KZp
//     MQIDAQAB
//     -----END PUBLIC KEY-----
//         `

//         let privateEncryptKey = `-----BEGIN RSA PRIVATE KEY-----
//         MIICWwIBAAKBgFS8jJxu7l9giCZxi5D9kHH1XOWTLT//2TH/9lPSazbmW4+sL15G
//         COI0272rxn92RZUCFA1cWysSulE+OihOz5b0THSZPcV/UuTUCJFssTw9oPOzOcR7
//         RM2SpFISbw0aSeAzuUZ3OmDGs9GZ6G21qkHnVxigSZqFKoLrERlsIS5hAgMBAAEC
//         gYASFaeg32AKhQypv8P8rtE8MRShfpbCuPT+4dUNsLPnJKTX9fSqFyJgPM3FHjsg
//         CvrwwV/MNjDS8Y1IN5Kr9Z4CJ8OStH39g8rOJq31zRKMQvQWwPOGrhtlBtawF2h1
//         Zyxjpa6DAiJxSOB0NH0OgAcANEmtI+J/ooYSnItDabhQjQJBAJV1h+zi0Vcw52sq
//         kXmztgcLwIzMzgQmFsfr0arbWkVg6pQQrF/yeDMW9yCnEeRw4fkBb7KyKl0N8nGh
//         jnau89cCQQCRI+8IeniLU92lQ5uO55wcxQMIExprJg0MXATuyYxwd/GKdg41tcWh
//         gl4uVmgwOWzm/1YieYWgF1h5nvv1wyiHAkATRT4rWutm9JVCChELwhIcQnWnMdj2
//         S/rv+AXmo7W18FMOmD/Bdz/sRm/CtAfojm10b6z5O2Oe7+dso0n9H32tAkEAhSFi
//         1nIQNCy/OCIlhBVqmvETcMqlBvemLFoTpDx3d4ptokXbjuSm3RjJ7tMPSnzCKbi4
//         d3LkYQ5I93YfQzS57QJAWXV+JdLdHyAMZpWvwsgrLBc0rkHBsHfiNC+/lOBIBKG1
//         m90l5+siuhQaYLuDHbVN4BWGzP6hv5+OOzvhIlOTWQ==
//         -----END RSA PRIVATE KEY-----`
        
//         var sig = new a.Signature({alg: 'SHA1withRSA'});
//          sig.init(prvKey);
//          sig.updateString('aaa');
//          var sigVal = sig.sign();
//         return encryptedItem;
//     // }
//     return null;
    
// }

export const verifyCustomerState = (loggedInData)=>{
    console.log("dsdsdsdsds",loggedInData)
    if(loggedInData.isProfileSet===false){
        history.push("/app/confirm-details");     
    }else{
        if(loggedInData.isPinSet===false){
            history.push("/app/create-pin");     
        }
    }

    
}

export const getImagePreview = (imageFile, height)=>{
    
        
        // reader.onload = function (e) {

        //     // giftCardImagePicker.classList.add('image-cover');
        //     // giftCardImagePicker.style.backgroundImage= `url('${e.target.result}')`;
        //                     // .width(150)"('src', e.target.result)
        //                     // .height(200);
            

        //     const preview = document.querySelector(`${preview}`);
        //     const file = document.querySelector('input[type=file]').files[0];
        //     const reader = new FileReader();

        //     reader.addEventListener("load", function () {
        //         // convert image file to base64 string
        //         preview.src = reader.result;
        //     }, false);

        //     if (file) {
        //         reader.readAsDataURL(file);
        //     }
            
            
            

        //     return preViewStyle;
        // };

        

        let preViewStyle;
        
        const file = imageFile.files[0];
        const reader = new FileReader();
        
        
        reader.addEventListener("load", function () {
            
            preViewStyle = {
                background: `url(${reader.result})`,
                height: (height!==null && height!==undefined && typeof height==="number")?height+'px': null,
                backgroundSize: `100% 100%`,
                backgroundPosition: `center center`
            }
            return preViewStyle;
        }, false);

        if (file) {
            reader.readAsDataURL(file);
        }

        

        
        // reader.readAsDataURL(input.files[0]);
}