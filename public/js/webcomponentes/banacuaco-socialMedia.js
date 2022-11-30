/**
 * Componente creado por Juan José Arteta Maury
 * 
 * Header Dinamico
 * 
 * Fecha de creacion 20/11/2022
 * 
 */
/** Importar de esta manera:
 * import {headerheaderbanacuaco} from "../webConponent/banacuaco-header.js";
 * 
 * createSocialMediaBanacuaco();
 */
 export function createSocialMediaBanacuaco() {

    class socialMediaBanacuaco extends HTMLElement {
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
                .socialMedia{
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    bottom: 5%;
                    position: fixed;
                    right: 2%;
                    row-gap: 15px;
                }
                
                .icon img{
                    cursor: pointer;
                }
                </style>`
        }

        getTemplate() {
            const template = document.createElement('template');
            template.innerHTML =
                `<div class="socialMedia">
                <div class="icon">
                    <img src="../images/facebook.svg" alt="">
                </div>
                <div class="icon">
                    <img src="../images/instagram.svg" alt="">
                </div>
                <div class="icon">
                    <img src="../images/youtube.svg" alt="">
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

    window.customElements.define('social-banacuaco', socialMediaBanacuaco);
};