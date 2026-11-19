import "server-only";
import Stripe from "stripe";

// Stripe vive en la cuenta del socio de YAJOS, no en la de maestria.studio (D-002, D-021). Las llaves
// llegan por variables de entorno; sin STRIPE_SECRET_KEY el cobro en línea queda apagado y el
// configurador sigue cerrando por WhatsApp.
const llave = process.env.STRIPE_SECRET_KEY;

export const stripe = llave ? new Stripe(llave) : null;

// Meses sin intereses (D-007): decisión del socio. Se enciende con STRIPE_MSI=1.
export const MSI = process.env.STRIPE_MSI === "1";
