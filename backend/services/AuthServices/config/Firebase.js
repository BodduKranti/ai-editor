import { cert, initializeApp } from 'firebase-admin'

// var serviceAccount = require("path/to/serviceAccountKey.json");

import serviceAccount from './serviceAccountKey.json' with {type: "json"}
export const app = initializeApp({
    credential: cert(serviceAccount)
});