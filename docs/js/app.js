/**
 * @version b0.0.1
 * @author IanZyon
 * @name Maquina_Enigma_Sim
 * 
 * Controladores/Modulos em js:
 * EnigmaController - Roda a Encriptação de letras no Back End
 * UiController - Seletores dos elementos de Ui, imprime resultados na UI
 * App - Event listeners e inicializadores
 * 
 */
console.log("Enigma Sandbox:");

/*
*
*
* Web APP IN MODULE PATTERN - IFFIS
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
        lightbulbButton: '.btn-lightbulb',
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
            <input class="btn btn-lightbulb" type="button" id="button${char}" value="${char}"></input>
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
                FAST: EnigmaController.getConfig().FAST,
                MID: EnigmaController.getConfig().MID ,
                SLO: EnigmaController.getConfig().SLO
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
        },
        printTexts: function(ciphertext, plaintext) {
            document.querySelector(uiSelectors.cipherOutput).firstChild.innerText = ciphertext;
            document.querySelector(uiSelectors.textOutput).firstChild.innerText = plaintext;
        }

    }
})();
/*
*
* APP CONTROLLER 
*
*/
const App = (function(EnigmaController, UiController){
    
    let cipherText = '';
    let plainText = '';
    let key = '';
    let cipherKey = '';
    // func Load Event Listeners
    const LoadEventListeners = function() {
        const UiSelectors = UiController.getSelectors();
        //Botoes
        document.querySelector(UiSelectors.configButton).addEventListener('click', rotorsManualConfig);
        document.querySelector(UiSelectors.clearButton).addEventListener('click', clearTexts);
        document.querySelector('.lightbulbs').addEventListener('click', cipherClickPrint );
        // Radio
        document.querySelector(UiSelectors.cipherRadio).addEventListener('click',modeConfig);
        document.querySelector(UiSelectors.cipherRadio).myParam = 'cipher';

        document.querySelector(UiSelectors.decipherRadio).addEventListener('click', modeConfig);
        document.querySelector(UiSelectors.decipherRadio).myParam = 'decipher';
        // Outputs
        

        document.onkeypress = (e) =>{
            e = e || window.event;
            if (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 97 && e.keyCode  <= 122 ){
                // botao e.key
                document.getElementById(`button${e.key.toUpperCase()}`).className += " active";
            }
        }
        document.onkeyup = cipherKeyPrint;
       
    };

    // cipherKeyPrint()
    const cipherKeyPrint = function(e) {
        e = e || window.event;
            key = e.key.toUpperCase()

            if (e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 97 && e.keyCode  <= 122 ){
                // botao e.key
                cipherKey = EnigmaController.runEnigma(key);

                document.getElementById(`button${cipherKey}`).focus();
                document.getElementById(`button${key}`).classList.remove("active");

                cipherText += cipherKey;
                plainText += key;
                
                UiController.printTexts(cipherText, plainText);
            }
    };
    const cipherClickPrint = function(e) {
        e = e || window.event;
        if( e.target.value != null){
            

            key = e.target.value.toUpperCase();

            if (key.charCodeAt() >= 65 && key.charCodeAt() <= 90 || key.charCodeAt() >= 97 && key.charCodeAt() <= 122 ){
                // botao e.key
                cipherKey = EnigmaController.runEnigma(key);

                document.getElementById(`button${cipherKey}`).focus();
                document.getElementById(`button${key}`).classList.remove("active");

                cipherText += cipherKey;
                plainText += key;
               
                UiController.printTexts(cipherText, plainText);
            }
        }
    }
    // func Manual Config dos Rotores
    const rotorsManualConfig = function() {
        // pega os dados da ui e passa para o EnigmaController
        let f = parseFloat(document.getElementById('fastRotor').value); 
        let m = parseFloat(document.getElementById('middleRotor').value); 
        let s = parseFloat(document.getElementById('slowRotor').value); 
        
        EnigmaController.newConfig(f,m,s);

    };
    // Configurar modo cifra e decifra
    const modeConfig = function(e) {
        
        EnigmaController.changeMode(e.target.myParam);
    };
    //
    const clearTexts = function () {
        cipherText = '';
        plainText = '';
        key = '';
        cipherkey = '';
        UiController.clearOutputs();
        rotorsManualConfig();

    };
    // func Resetar Estado do App
    const resetState = function() {

    };
    
    

    
    return {
        init: function() {
            // resetar o estado do App - Backend
            // resetar UI - FrontEnd
            UiController.populate();
            // carregar os Event Listeners
            LoadEventListeners();
        }
    };


})(EnigmaController, UiController);//<-- passar aqui funções usadas no App

App.init(); // <-- inicializar o app
