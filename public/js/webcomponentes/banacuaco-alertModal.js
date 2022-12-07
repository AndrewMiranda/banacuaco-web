/**
 * Componente creado por Juan José Arteta Maury
 * 
 * Header Dinamico
 * 
 * Fecha de creacion5/12/2022
 * 
 */
/** Importar de esta manera:
 * import {createAlertModal} from "../webConponent/banacuaco-alertModal.js";
 * 
 * createAlertModal();
 */
export function createAlertModal() {

    class alertModalBanacuaco extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

        static get observedAttributes(){
            return["hide"]
        }

        attributeChangedCallback(attr, oldValue, newVal){

            if (attr === "hide") {
                this.hide = newVal;
            }

        }

        getStyle() {
            return `
            <style>
                @charset "utf-8";
                @font-face {
                    font-family: "arnold";
                    src: url("../fonts/arnold-21_[allfont.es].ttf");
                }
        
                @font-face {
                    font-family: "roboto-bold";
                    src: url("../fonts/Roboto/Roboto-Bold.ttf");
                }
        
        
                #alertModal{
                    position: fixed;
                    width: 100vw;
                    height: 100vh;
                    top: 0;
                    left: 0;
                    background-color: #00000090;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 10000000;
                }
            
                .containerAlert{
                    background-color: #FFF;
                    width: 88%;
                    max-width: 480px;
                    border-radius: 10px;
                    -moz-border-radius: 10px;
                    -webkit-border-radius: 10px;
                }
        
                .contentInfo{
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                }
            
                .contentInfo img{
                    width: 33%;
                    height: auto;
                }
            
                .textInfo{
                    width: 60%;
                    padding: 18px 18px 0 0;
                }
        
                .titleAlert{
                    font-size: 30px;
                    font-weight: bold;
                    text-align:right;
                    margin-bottom: 25px;
                    line-height: 1.5;
                    color: #B73310;
                    font-family: "arnold";
                }
        
                .descriptionText{
                    font-size: 16px;
                    text-align:right;
                    line-height: 1.5;
                    color: #707070;
                    font-family: "roboto-bold";
                }
        
                .containerAlertButtons{
                    width: 100%;
                    padding: 16px;
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    box-sizing: border-box;
                }
        
                .AlertButtons{
                    padding: 8px 18px;
                    border-radius: 20px;
                    -moz-border-radius: 20px;
                    -webkit-border-radius: 20px;
                    color: #FFF;
                    font-size: 18px;
                    border: none;
                    cursor: pointer;
                    font-family: "roboto-bold";
                }
        
                .buttonCancel{
                    background-color: #FFBD00;
                    display:block ;
                }
        
        
                .buttonDelete{
                    background-color: #B73310;
                    margin-left: 25px;
                }
                @media screen and (max-width: 902px) {
                    .contentInfo img{
                        height: 34%;
                    }
                }
            </style>`
        }

        getTemplate() {
            const template = document.createElement('template');
            template.innerHTML =
                `<div id="alertModal">
                    <div class="containerAlert">
                        <div class="contentInfo">
                            <img src="../images/deleteAlert.svg" alt="eliminar">
                            <div class="textInfo">
                                <div class="titleAlert">Eliminar</div>
                                <div class="descriptionText">¿Estas seguro que quieres eliminar?</div>
                            </div>
                        </div>
                        <div class="containerAlertButtons">
                            <div class=" AlertButtons buttonCancel" onclick="cancelAlert()">Cancelar</div>
                            <div class="AlertButtons  buttonDelete" onclick="eliminar()">Eliminar</div>
                        </div>
                    </div>
                </div>
        ${this.getStyle()}`;
            return template;
        }

        connectedCallback() {
            this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
        };

        disconnectedCallback() { }

    };

    window.customElements.define('modal-banacuaco',  alertModalBanacuaco);
};

export function cancelar(){
    document.querySelector('modal-banacuaco').remove();
};


export function launchAlert(){
    let alert = document.createElement('modal-banacuaco');

    document.body.appendChild(alert);
};