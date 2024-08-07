# API di Ricette Culinarie

## Descrizione del Progetto

Questa applicazione è un'API RESTful progettata per permettere agli utenti di caricare, cercare e salvare ricette culinarie. Gli utenti possono registrarsi, autenticarsi, e quindi creare, leggere, aggiornare e cancellare (CRUD) ricette. L'API supporta anche la valutazione e i commenti sulle ricette da parte degli utenti registrati. Le immagini delle ricette possono essere caricate e gestite tramite un servizio di storage cloud.

## Caratteristiche principali
- *Autenticazione e autorizzazione degli utenti:* Gli utenti possono registrarsi e accedere utilizzando JWT (JSON Web Tokens).

- *CRUD per le ricette:* Gli utenti possono creare, leggere, aggiornare e cancellare le ricette.

- *Ricerca e filtraggio:* Le ricette possono essere cercate e filtrate per ingredienti, tipo di piatto, tempo di cottura, ecc.

- *Valutazioni e commenti:* Gli utenti possono valutare e commentare le ricette.

- *Gestione delle immagini:* Le immagini delle ricette possono essere caricate e memorizzate in un servizio di storage cloud come AWS S3.

## Tecnologie utilizzate

- *Backend:* Node.js con Express.
- *Database:* PostgreSQL.
- *Autenticazione:* JWT (JSON Web Tokens).