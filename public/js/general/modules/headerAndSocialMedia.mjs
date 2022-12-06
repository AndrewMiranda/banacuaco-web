import {createheaderbanacuaco} from "../../webcomponentes/banacuaco-header.js";

import {createSocialMediaBanacuaco} from "../../webcomponentes/banacuaco-socialMedia.js";

import {createAlertModal , cancelar, launchAlert} from "../../webcomponentes/banacuaco-alertModal.js";


launchAlertModal = launchAlert;

closeAlert = cancelar;



createAlertModal();
createheaderbanacuaco();

createSocialMediaBanacuaco();

