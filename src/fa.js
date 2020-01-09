
import * as faMapping from '@philly/vue-mapping/src/fa.js';

// Font Awesome Icons
import { library } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons/faBars';
import { faSpinner } from '@fortawesome/free-solid-svg-icons/faSpinner';
import { faCircle } from '@fortawesome/free-solid-svg-icons/faCircle';
// import { faHexagon } from '@fortawesome/pro-solid-svg-icons/faHexagon';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons/faInfoCircle';
// import { faLocationArrow } from '@fortawesome/pro-solid-svg-icons/faLocationArrow';
library.add(faSpinner, faBars, faCircle, faInfoCircle);

export default library;
