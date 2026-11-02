import { getLoggedInIdentity } from "./src/utils/authIdentity.js";

const identity = getLoggedInIdentity();

console.log("=================================");
console.log("SICR LOGGED-IN IDENTITY");
console.log("=================================");

if (!identity) {
    console.log("No logged-in SICR ecosystem found.");
} else {
    console.log("Ecosystem:", identity.type);
    console.log("MongoDB ID:", identity.id);
    console.log("JWT Payload:", identity.payload);
}
