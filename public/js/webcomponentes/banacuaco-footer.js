/**
 * Componente creado por Juan José Arteta Maury
 * 
 * Header Dinamico
 * 
 * Fecha de creacion 20/11/2022
 * 
 *
 * 
 * createSocialMediaBanacuaco();
 */

export function createFooterBanacuaco() {

    class footerBanacuaco extends HTMLElement {
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
                    font-family: "arial-Rounded";
                    src: url("../fonts/arlrdbd.ttf");
                }

                @font-face {
                    font-family: "arnold";
                    src: url("../fonts/arnold-21_[allfont.es].ttf");
                }
                
            *{
                color:#333;
            }
            footer {
                background-color: #f0f4fb;
                width: 100%;
                margin-top: 20px;
                }
                
                .contentFooter {
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                align-items: center;
                padding: 20px 5%;
                }
                .autores p{
                    color: #7b8ca0;
                    font-size: 18px;
                    font-family:"arnold";
                }
                @media screen and (max-width: 720px) {
                .contentFooter {
                    display: flex;
                    justify-content: center;
                    flex-wrap: wrap;
                    padding: 20px 5%;
                }
            }
        <style>`
        }

        getTemplate() {
            const template = document.createElement('template');
            template.innerHTML =
                `<footer>
                    
                <div class="contentFooter">
                    <div class="autores">
                        <p>© 2022 Banacuaco - BioIdeaz </p>
                    </div>
                </div>
            </footer>
        ${this.getStyle()}`;
            return template;
        }

        connectedCallback() {
            this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
        };

        disconnectedCallback() { }

    };

    window.customElements.define('footer-banacuaco', footerBanacuaco);
};