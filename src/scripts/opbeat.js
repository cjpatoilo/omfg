
// Opbeat
// ––––––––––––––––––––––––––––––––––––––––––––––––––

;(() => {

	'use strict';

	if (window.location.hostname === 'localhost') return;

	const APP_ID = 'aa009f4eb4',
		ORG_ID = 'bfc2d2b1867d4ade86c9030c6985cfa2',
		OPBEAT_URL = 'bower_components/opbeat-js/opbeat.min.js';

	((i, s, o, g, r, a, m, n) => {
		n = s.createElement(o);
		n.async = 1;
		n.src = g;
		n.setAttribute('data-org-id', r);
		n.setAttribute('data-app-id', a);
		m = s.getElementsByTagName(o)[document.querySelectorAll(o).length - 1];
		m.parentNode.insertBefore(n, m);
	})(window, document, 'script', OPBEAT_URL, ORG_ID, APP_ID);

})();
