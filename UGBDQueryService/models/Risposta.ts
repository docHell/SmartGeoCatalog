export class Risposta {
    status: string;
    esito: boolean;
    data : Date;
    valore : any;


    constructor(status: string, esito : boolean, valore : any) {
        this.data = new Date();
        this.status = status;
        this.esito = esito;
        this.valore = valore;
    }

    public static of(r : any) : Risposta {
        console.log(r);
        let exit = new Risposta(r.status,r.esito,r.valore);
        exit.data = new Date(r.data);
        return exit;
    }
    
}