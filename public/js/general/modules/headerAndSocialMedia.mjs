import {createheaderbanacuaco} from "../../webcomponentes/banacuaco-header.js";

import {createFooterBanacuaco} from "../../webcomponentes/banacuaco-footer.js";

import {createSocialMediaBanacuaco} from "../../webcomponentes/banacuaco-socialMedia.js";

import {createAlertModal , cancelar, launchAlert, borrarRegistro} from "../../webcomponentes/banacuaco-alertModal.js";


launchAlertModal = launchAlert;

closeAlert = cancelar;

deleteRow = borrarRegistro;

createAlertModal();
createheaderbanacuaco();

createSocialMediaBanacuaco();

createFooterBanacuaco();

