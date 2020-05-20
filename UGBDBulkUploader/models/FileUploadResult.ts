export class FileUploadResult {
    public error : string;
    public filename : string;
    
    constructor(filename : string,error: string) {
        this.error= error;
        this.filename = filename;
    }
    public static success(filename : string) : FileUploadResult {
        return new FileUploadResult(filename,null);
    }

    public static error(filename : string,error: string)  : FileUploadResult {
        return new FileUploadResult(filename,error);
    }
    
}