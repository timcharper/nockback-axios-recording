import axios from "axios";

// Configure axios to use the Node adapter for Nock interception.
// If you are using jsdom, axios will default to using the XHR adapter which
// can't be intercepted by nock. So, configure axios to use the node adapter.
//
// References:
// https://github.com/axios/axios/pull/5277
axios.defaults.adapter = "http";

