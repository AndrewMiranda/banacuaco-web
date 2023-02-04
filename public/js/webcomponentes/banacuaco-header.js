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
 * createheaderbanacuaco();
 */
export function createheaderbanacuaco() {

    class headerheaderbanacuaco extends HTMLElement {
        constructor() {
            super();
            this.attachShadow({ mode: 'open' });
        }

        static get observedAttributes(){
            return["hide", "languaje"]
        }

        attributeChangedCallback(attr, oldValue, newVal){

            if (attr === "hide") {
                this.hide = newVal;
            }
            if (attr === "languaje") {
                this.languaje = newVal;
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
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                    font-family: "roboto-regular", sans-serif;
                    text-decoration: none;
                    color: #333; /*color de textos*/
                }
                
                .imgHeader{
                    height: 15vw;
                    width: 100%;
                }
                
                .imgHeader img{
                    height: 100%;
                    width: 100%;
                    object-fit: cover;
                }
                
                .navBar{
                    width: 100%;
                    margin: 0;
                    background-color: #FFBD00;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.2vw 5%;
                }
                
                .navBar a p{
                    font-family: "arnold";
                    color: #80240B;
                    font-size: 2vw;
                }
                
                .optionsLanguaje{
                    width: 35%;
                    padding: 1vw;
                    background-color: #B73310;
                    column-gap: 20px;
                    margin-right: 0;
                    margin-left: auto;
                    display: flex;
                }
                
                .content{
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    column-gap: 10%;
                }
                
                .spanish,
                .english{
                    display: flex;
                    align-items: center;
                    column-gap: 10px;cursor: pointer;
                }
                
                .spanish img,
                .english img{
                    height: 3vwpx;
                    width: 3vw;
                }
                
                .english p,
                .spanish p{
                    font-family: "arnold";
                    font-size: 1.5vw;
                    color: #fff;
                }
                
                /**
                Menu hamburguesa
                */
                
                #btnMenu {
                    display: none;
                }
                
                .hamburgerMenu{
                    display: none;
                }
                
                
                .menu{
                    display: none;
                }
                
                .contentMenu{
                    background-color: #FFBD00;
                    width: 100vw;
                    max-width: 290px;
                    height: 100%;
                    overflow: auto;
                    margin-right: 0%;
                    margin-left: auto;
                    padding-top: 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    row-gap: 40px;
                    position: absolute;
                    z-index: 1000;
                }
                
                .contentMenu a p{
                    font-family: "arnold";
                    color: #80240B;
                    font-size: 2vw;
                    display: flex;
                    flex-direction: column;
                    row-gap: 100px;
                }
                
                #btnMenu:checked ~ .menu {
                    display: block;
                    margin-left: calc(100% - 290px);
                }
                

                @media screen and (max-width: 768px) {

                    .imgHeader {
                        height: 140px;
                        width: 100%;
                    }
                
                    .navBar{
                        display: none;
                    }
                
                    .hamburgerMenu{
                        display: flex;
                        align-items: center;
                        justify-content: end;
                        height: 50px;
                        background-color: #FFBD00;
                        padding: 0 5%;
                    }
                    .iconoMenu {
                        display: flex;
                        justify-content: end;
                        cursor: pointer;
                        height: 40px;
                    }
                    .optionsLanguaje{
                        width: 100%;
                        height: 50px;
                    }
                
                    .spanish img,
                    .english img{
                    height: 30px;
                    width: 35px;
                }
                }
                
                </style>`
        }

        getTemplate() {
            const template = document.createElement('template');
            if (this.languaje === 'es') {
                template.innerHTML =
                        `<header>
                        <div class="conainerHeader">
                            <a href="/${this.languaje}/home">
                                <div class="imgHeader">
                                    <img src="../images/BANACUACO Banner2 Youtube 2022 web.jpg" alt="banacuaco">
                                </div>
                            </a>
                            <div class="">
                                <div class="navBar">
                                    <a href="/${this.languaje}/producciones">
                                        <p>Producciones</p>
                                    </a>
                                    <a href="/${this.languaje}/servicios">
                                        <p>Servicios</p>
                                    </a>
                                    
                                    <a href="/${this.languaje}/nosotros">
                                        <p>Nosotros</p>
                                    </a>
                                    
                                    <a href="/${this.languaje}/galeria">
                                        <p>Galería</p>
                                    </a>
                                    
                                    <a href="/${this.languaje}/contacto">
                                        <p>Contáctenos</p>
                                    </a>
                                </div>
                                <div class="hamburgerMenu">
                                    <label for="btnMenu">
                                        <img
                                            src="../images/menuMobil.svg"
                                            class="iconoMenu"
                                            id="menuClick"
                                            onclick="changeMenu()"
                                        />
                                    </label>
                                </div>
                            </div>
                            <div class="optionsLanguaje">
                                <div class="content">
                                    <div class="english" onclick="es_en('en')">
                                        <img src="../images/american-flag.png" alt="">
                                        <p>Inglés</p>
                                    </div>
                                    <div class="spanish" onclick="es_en('es')">
                                        <img src="../images/colombia.png" alt="">
                                        <p>Español</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input type="checkbox" id="btnMenu" />
                        <div class="menu">
                            <div class="contentMenu">
                            <a href="/${this.languaje}/producciones">
                                <p>Producciones</p>
                            </a>
                            <a href="/${this.languaje}/servicios">
                                <p>Servicios</p>
                            </a>
                            
                            <a href="/${this.languaje}/nosotros">
                                <p>Nosotros</p>
                            </a>
                            
                            <a href="/${this.languaje}/galeria">
                                <p>Galería</p>
                            </a>
                            
                            <a href="/${this.languaje}/contacto">
                                <p>Contáctenos</p>
                            </a>
                                
                            </div>
                        </div>
                
                    </header>
                ${this.getStyle()}`;
            }
            if (this.languaje === 'en') {
                        template.innerHTML =
                        `<header>
                        <div class="conainerHeader">
                            <a href="/${this.languaje}/home">
                                <div class="imgHeader">
                                    <img src="../images/BANACUACO Banner2 Youtube 2022 web.jpg" alt="banacuaco">
                                </div>
                            </a>
                            <div class="">
                                <div class="navBar">
                                    <a href="/${this.languaje}/producciones">
                                        <p>Productions</p>
                                    </a>
                                    <a href="/${this.languaje}/servicios">
                                        <p>Services</p>
                                    </a>
                                    
                                    <a href="/${this.languaje}/nosotros">
                                        <p>About Us</p>
                                    </a>
                                    
                                    <a href="/${this.languaje}/galeria">
                                        <p>Gallery</p>
                                    </a>
                                    
                                    <a href="/${this.languaje}/contacto">
                                        <p>Contact Us</p>
                                    </a>
                                </div>
                                <div class="hamburgerMenu">
                                    <label for="btnMenu">
                                        <img
                                            src="../images/menuMobil.svg"
                                            class="iconoMenu"
                                            id="menuClick"
                                            onclick="changeMenu()"
                                        />
                                    </label>
                                </div>
                            </div>
                            <div class="optionsLanguaje">
                                <div class="content">
                                    <div class="english" onclick="es_en('en')">
                                        <img src="../images/american-flag.png" alt="">
                                        <p>English</p>
                                    </div>
                                    <div class="spanish" onclick="es_en('es')">
                                        <img src="../images/colombia.png" alt="">
                                        <p>Spanish</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <input type="checkbox" id="btnMenu" />
                        <div class="menu">
                            <div class="contentMenu">
                            <a href="/${this.languaje}/producciones">
                                <p>Productions</p>
                            </a>
                            <a href="/${this.languaje}/servicios">
                                <p>Services</p>
                            </a>
                            
                            <a href="/${this.languaje}/nosotros">
                                <p>About Us</p>
                            </a>
                            
                            <a href="/${this.languaje}/galeria">
                                <p>Gallery</p>
                            </a>
                            
                            <a href="/${this.languaje}/contacto">
                                <p>Contact Us</p>
                            </a>
                                
                            </div>
                        </div>
                
                    </header>
                ${this.getStyle()}`;
            }
            
            return template;
        }

        connectedCallback() {
            this.shadowRoot.appendChild(this.getTemplate().content.cloneNode(true));
        };

        disconnectedCallback() { }

    };

    window.customElements.define('header-banacuaco', headerheaderbanacuaco);
};
