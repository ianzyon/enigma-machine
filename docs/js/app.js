/**
 * @version b0.0.1
 * @author Atarax
 * @name Maquina_Zenigma
 * 
 * Controladores/Modulos em js:
 * EnigmaController - Roda a Encriptação de letras no Back End
 * UiController - Seletores dos elementos de Ui, imprime resultados na UI
 * App - Event listeners e inicializadores
 * 
 */
const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
let FAST = newRotorGen();
let MID = newRotorGen();
let SLO = newRotorGen();
let R1 = 3;
let R2 = 10;
let R3 = 8;
rotorsConfig(R1, R2, R3);


// Gerador de Rotores
function newRotorGen(){
    let newRotor = [];
    for(let i = 0; i <= 25; i++){
        newRotor.push(i);
    }
    return newRotor;
}
// 
function rotorsConfig(x,y,z){
    FAST = newRotorGen();
    MID = newRotorGen();
    SLO = newRotorGen();
    FAST = FAST.map((elem)=>{
        return elem + x > 25 ? (elem + x) - 26: elem + x;
    });
    MID = MID.map((elem)=>{
        return elem + y > 25 ? (elem + y) - 26: elem + y;
    });
    SLO = SLO.map((elem)=>{
        return elem + z > 25 ? (elem + z) - 26: elem + z;
    });

}
// funcao runEnigma() -- recebe letra e configuração dos rotores para fazer a cifragem
function runEnigma(LE, mode){ 
    let result;
    if (mode === 'cipher'){
        result = cipher(LE);
    } else if ( mode === 'decipher'){
        result = decipher(LE);
    }
    rotation();
    rotorsConfig(R1, R2, R3);
    return result;

}
// funcao rotation() - fara a rotacao dos rotores apos o uso
function rotation() {
    R1 += 1;
    if( R1 > 25 ) {
        R2 += 1;
        R1 = 0;
        if(R2 > 25){
            R3 += 1;
            R2 = 0;
            if( R3 > 25 ){
                R3 = 0;
            }
        } 
    }
}


// funcao cipher
function cipher(letter) {
    let S1;
    let S2;
    let S3;
    let CE;
    let LE = codeLetter(letter);
    S1 = FAST[LE];
    S2 = MID[S1];
    S3 = SLO[S2];
    CE = decodeLetter(S3);
    return CE;

}

// funcao decipher
function decipher(letter) {
    let S1;
    let S2;
    let S3;
    let DE;
    let CE = codeLetter(letter);
    S1 = SLO.indexOf(CE); // o inverso de cipher é enviar as posições dos codigos iniciando pelo rotor slow
    S2 = MID.indexOf(S1);
    S3 = FAST.indexOf(S2);
    DE = decodeLetter(S3);
    return DE;
}
// encode Letter
function codeLetter(letter) {
    let encoded = 0;
    let plain = letter.toLowerCase();
    for(let k = 0; k < alphabet.length; k++) {
        let alpha = alphabet[k];
        if(plain === alpha){
            encoded = k;
        }
    }
    return encoded
}
// Decode Letter
function decodeLetter(num) {
    let decoded = "";
    for(let i = 0; i < alphabet.length; i++) {
        if(num === i) {
            decoded = alphabet[i].toUpperCase();
        }
    }
    return decoded;
}
console.log("Enigma Sandbox:");

// console.log(cipher('D'));
// console.log(runEnigma('Y','decipher'));
// console.log(runEnigma('W','decipher'));
// console.log(runEnigma('O','decipher'));
// console.log(runEnigma('B','decipher'));
// console.log(runEnigma('N', 'decipher'));
// console.log(runEnigma('O', 'cipher'));
// console.log(runEnigma('I', 'cipher'));
// console.log(runEnigma('B', 'cipher'));
// console.log(runEnigma('O', 'cipher'));
// console.log(runEnigma('A', 'cipher'));

// console.log(R1,R2,R3);
// console.log(FAST);


/*
*
*
* Web APP MODULE PATTERN - IFFIS
*
*
*/

/*
*
* ENIGMA CONTROLLER 
*
*/

const EnigmaController = (function() {
    const alphabet = ['a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r','s','t','u','v','w','x','y','z'];
    let R1 = 0;
    let R2 = 0;
    let R3 = 0;
    let modeState = 'cipher';
    let FAST;
    let MID;
    let SLO;
    rotorsConfig(R1, R2, R3);

    function newRotorGen(){
        let newRotor = [];
        for(let i = 0; i <= 25; i++){
            newRotor.push(i);
        }
        return newRotor;
    }
    function rotorsConfig(x,y,z){
        R1 = x;
        R2 = y;
        R3 = z;
        FAST = newRotorGen();
        MID = newRotorGen();
        SLO = newRotorGen();
        // if( x != 0 && y !=0 && z != 0) {
            FAST = FAST.map((elem)=>{
                return elem + R1 > 25 ? (elem + R1) - 26: elem + R1;
            });
            MID = MID.map((elem)=>{
                return elem + R2 > 25 ? (elem + R2) - 26: elem + R2;
            });
            SLO = SLO.map((elem)=>{
                return elem + R3 > 25 ? (elem + R3) - 26: elem + R3;
            });
        
    
    }

    // funcao rotation() - fara a rotacao dos rotores apos o uso
    const rotation = function() {
        R1 += 1;
        if( R1 > 25 ) {
            R2 += 1;
            R1 = 0;
            if(R2 > 25){
                R3 += 1;
                R2 = 0;
                if( R3 > 25 ){
                    R3 = 0;
                }
            } 
        }
    }
    // encode Letter
    const codeLetter = function(letter) {
        let encoded = 0;
        let plain = letter.toLowerCase();
        for(let k = 0; k < alphabet.length; k++) {
            let alpha = alphabet[k];
            if(plain === alpha){
                encoded = k;
            }
        }
        return encoded
    }
    // Decode Letter
    const decodeLetter = function(num) {
        let decoded = "";
        for(let i = 0; i < alphabet.length; i++) {
            if(num === i) {
                decoded = alphabet[i].toUpperCase();
            }
        }
        return decoded;
    }
    // funcao cipher
    const cipher =  function(letter) {
        let S1;
        let S2;
        let S3;
        let CE;
        let LE = codeLetter(letter);
        S1 = FAST[LE];
        S2 = MID[S1];
        S3 = SLO[S2];
        CE = decodeLetter(S3);
        return CE;
    }

    // funcao decipher
    const decipher = function(letter) {
        let S1;
        let S2;
        let S3;
        let DE;
        let CE = codeLetter(letter);
        S1 = SLO.indexOf(CE); // o inverso de cipher é enviar as posições dos codigos iniciando pelo rotor slow
        S2 = MID.indexOf(S1);
        S3 = FAST.indexOf(S2);
        DE = decodeLetter(S3);
        return DE;
    }
    const enigmaCipher = function(letter) { 

            rotation();
            rotorsConfig(R1, R2, R3);
            let result;
            if (modeState === 'cipher'){
                result = cipher(letter);
            } else if ( modeState === 'decipher'){
                result = decipher(letter);
            }
            

            return result;

    }
    return { 
        // Gera um array de 0 a 25 
        newConfig: function(f,m,s) {
            return rotorsConfig(f,m,s);
        },
        changeMode: function(mode) {
            modeState = mode;
        },
        // funcao runEnigma() -- recebe letra e configuração dos rotores para fazer a cifragem e um modo
        runEnigma: function(letter) { 
            return enigmaCipher(letter);
        },
        reset: function() {
            R1 = 1;
            R2 = 1;
            R3 = 1;
            rotorsConfig(0,0,0);
            modeState = 'cipher';
        },
        getConfig: function() {
            return {
                R1: R1,
                R2: R2,
                R3: R3,
                FAST: FAST,
                MID: MID,
                SLO: SLO,
                mode: modeState
            }
        }
    }
})();


/*
*
* UI CONTROLLER 
*
*/

const UiController = (function() {
    const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z',''];

    const uiSelectors = {
        lightbulbsRow: '.lightbulbs',
        configButton: '#configRotors',
        clearButton: '#clearOutput',
        cipherOutput: '#outputCipher',
        textOutput: '#outputPlainText',
        cipherRadio: '#cipherRadio',
        decipherRadio: '#decipherRadio',
    }
    const createLightbulbs = function(){
        let html = ``;
        alphabet.forEach((char)=>{
            html += `
            <input class="btn btn-lightbulb" type="button" id="button${char}"value="${char}"></input>
            `;
        });
        document.querySelector(uiSelectors.lightbulbsRow).innerHTML = html;
    }
    return {
        // popular a UI com os dados atuais
        populate: function() {
            createLightbulbs();
        },

        // get seletores
        getSelectors: function() {
            return uiSelectors
        },
        // Pega as configurações de rotor e modo passadas na ui
        getConfigInput: function() {
            return {
                FAST: '' ,
                MID: '' ,
                SLO: ''
            }
           
        },
        // Decidir se vai pegar o Texto da Text Area ou Letra por Letra
        getKeyInput: function(){
            return key;
        },
        // limpar campos na ui
        clearOutputs: function() {
            document.querySelector(uiSelectors.cipherOutput).firstChild.innerText = '';
            document.querySelector(uiSelectors.textOutput).firstChild.innerText = '';
        }

    }
})();
/*
*
* APP CONTROLLER 
*
*/
const App = (function(EnigmaController, UiController){
    
    
    // func Load Event Listeners
    const LoadEventListeners = function() {
        const UiSelectors = UiController.getSelectors();
        //Botoes
        document.querySelector(UiSelectors.configButton).addEventListener('click', rotorsManualConfig);
        document.querySelector(UiSelectors.clearButton).addEventListener('click', UiController.clearOutputs);

        document.querySelector(UiSelectors.cipherRadio).addEventListener('click',modeConfig);
        document.querySelector(UiSelectors.cipherRadio).myParam = 'cipher';

        document.querySelector(UiSelectors.decipherRadio).addEventListener('click', modeConfig);
        document.querySelector(UiSelectors.decipherRadio).myParam = 'decipher';

        //Switches
        //Form config

        document.onkeypress = (e) =>{
            e = e || window.event;
            let key = e.key.toUpperCase()
            if (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 97 && e.keyCode  <= 122 ){
                // botao e.key
                document.getElementById(`button${key}`).className += " active";
            }
        }
        document.onkeyup = (e) =>{
            e = e || window.event;
            let key = e.key.toUpperCase()
            if (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 97 && e.keyCode  <= 122 ){
                // botao e.key
                let cipherKey;
                
                
                cipherKey = EnigmaController.runEnigma(key);
                console.log(cipherKey);
                document.getElementById(`button${cipherKey}`).focus();
                document.getElementById(`button${key}`).classList.remove("active");
            }
        }
       
    };

    // func Manual Config dos Rotores
    const rotorsManualConfig = function() {
        // pega os dados da ui e passa para o EnigmaController
        let f = parseFloat(document.getElementById('fastRotor').value); 
        let m = parseFloat(document.getElementById('middleRotor').value); 
        let s = parseFloat(document.getElementById('slowRotor').value); 
        console.log('config sent: ', f,m,s);
        EnigmaController.newConfig(f,m,s);

    };
    // Configurar modo cifra e decifra
    const modeConfig = function(e) {
        console.log('clicked', e.target.myParam);
        EnigmaController.changeMode(e.target.myParam);
    }
    // func Resetar Estado do App
    const resetState = function() {

    };
    
    

    
    return {
        init: function() {
            // resetar o estado do App - Backend

            // carregar os Event Listeners
            LoadEventListeners();
            // resetar UI - FrontEnd
            UiController.populate();
        }
    }


})(EnigmaController, UiController);//<-- passar aqui funções usadas no App

App.init(); // <-- inicializar o app
