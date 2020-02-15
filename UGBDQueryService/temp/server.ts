import { DbJobs } from './../providers/DbJobs';
import { HttpJobs } from './../providers/HttpJobs';

import app from "./app";
import { Risposta } from '../models/Risposta';
import { Account } from '../models/Account';
const PORT = 3000;


app.post('/gioca', DbJobs.getInstance().authorisation,(req, res, next)  => {
    console.log("body received ->", req.body);
    DbJobs.getInstance().getAccountId(req.body.account.email).subscribe( (account: Account) => {
        if (account) {
            HttpJobs.getInstance().getEsito(account, req.body.account.segno).subscribe( (risposta : Risposta) => {
                if (risposta.esito) {
                    try {
                        account.setEsito(req.body.account.segno,risposta.valore.win, risposta.valore);
                        DbJobs.getInstance().aggiornaAccount(account).subscribe( (r : Risposta) => {
                            res.json(new Risposta("Errore server Vincite", true, risposta.valore));
                        } );
                    } catch (e) {
                        res.json(new Risposta("L'utente ha già giocato", false, null));
                    }
                 } else {
                    res.json(new Risposta("Errore server Vincite", false, null));
                 }
            });
        } else {
            res.json(new Risposta("Utente non trovato", false, null));
        }

    })
});

app.get('/prova', (req, res) => {
    res.json(new Risposta("Server in funzione", false, new Date()));
});

app.post('/iscriviti', DbJobs.getInstance().authorisation, (req, res, next) => {

    console.log("body received ->", req.body);

    DbJobs.getInstance().iscriviAccount(req.body).subscribe((esito: Risposta) => {


        console.log("--------|||---------------------------------------------");
        console.log("Esito ?  ", esito);

        if (esito) {
            if (esito.status) {
                res.json(esito);
                console.log("--------|||OK");
            } else {
                res.json(esito);
                console.log("--------||NON OK");
            }
        }

        console.log("--------|||---------------------------------------------");
    });


});


app.listen(PORT, () => {
    console.log('Express server listening on port p1d ' + PORT);
})