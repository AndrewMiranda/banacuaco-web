export function createGaleryModal() {

    class galeryModal extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
            this.url;
            this.autor;
            this.descen;
            this.desces;
        }

        static get observedAttributes(){
            return["hide", "url", "autor", "descen", "desces"]
        }

        attributeChangedCallback(attr, oldValue, newVal){

            if (attr === "hide") {
                this.hide = newVal;
            }if (attr === "url") {
                this.url = newVal;
            }if (attr === "autor") {
                this.autor = newVal;
            }if (attr === "descen") {
                this.descen = newVal;
            }if (attr === "desces") {
                this.desces = newVal;
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
                    position: relative;
                    background-color: #FFF;
                    border-radius: 10px;
                    -moz-border-radius: 10px;
                    -webkit-border-radius: 10px;
                    display: flex;
                    align-items: center;
                    flex-wrap: wrap;
                    max-width: 80vw;
                    width: 900px;
                }

                .containerAlertA{
                    position: relative;
                    height: 85vh;
                    overflow: scroll;
                    scrollbar-width: none;
                }

                .containerAlert::-webkit-scrollbar {
                    width: 0;
                }

                img{
                    width: 100%;
                    height: auto;
                    max-height: 90%;
                    object-fit: contain;
                    border-radius: 10px 10px 0 0;
                    -moz-border-radius: 10px 10px 0 0;
                    -webkit-border-radius: 10px 10px 0 0;
                }
            
                .textInfo{
                    width: 900px;
                    max-width: 80vw;
                    padding: 18px 0 0 0;
                }

                .textInfo:last-child{
                    margin-bottom: 22px;
                }

                .titleAlert{
                    font-size: 28px;
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 12px;
                    line-height: 1;
                    color: #B73310;
                    font-family: "arnold";
                }
        
                .descriptionText{
                    font-size: 19px;
                    text-align: center;
                    line-height: 1.5;
                    color: #707070;
                    font-family: 'roboto-regular', sans-serif;
                }
        
                .containerAlertButtons{
                    position: relative;
                    width: 900px;
                    max-width: 80vw;
                    padding: 16px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-sizing: border-box;
                    top: -12%;
                    right: -50%;
                }
        
                .AlertButtons{
                    padding: 9px 14px;
                    border-radius: 20px;
                    -moz-border-radius: 20px;
                    -webkit-border-radius: 20px;
                    color: #FFF;
                    font-size: 18px;
                    border: none;
                    cursor: pointer;
                    font-family: 'roboto-regular', sans-serif;
                    position: absolute;
                    z-index: 100000000;
                    top: -20px;
                    right: -20px;
                }

                .buttonCancel{
                    background-color: #FFBD00;
                    display:block ;
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
                        <div class="containerAlertA">
                            <img src="../content/${this.url}" alt="imagen">
                            <div class="textInfo">
                                <div class="titleAlert">Autor</div>
                                <div class="descriptionText">${this.autor}</div>
                            </div>
                            <div class="textInfo">
                                <div class="titleAlert">Descripción inglés</div>
                                <div class="descriptionText">${this.descen}</div>
                            </div>
                            <div class="textInfo">
                                <div class="titleAlert">Descripción español</div>
                                <div class="descriptionText">${this.desces}</div>
                            </div>
                        </div>
                        <div class=" AlertButtons buttonCancel" onclick="closeModal()">X</div>
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

    window.customElements.define('galery-modal',  galeryModal);
};

export function cancel(){
    document.querySelector('galery-modal').remove();
};

export function launchModalGalery(url, autor, descen, desces){
    let modal = document.createElement('galery-modal');
    modal.setAttribute("url", url);
    modal.setAttribute("autor", autor);
    modal.setAttribute("descen", descen);
    modal.setAttribute("desces", desces);
    document.body.appendChild(modal);
};