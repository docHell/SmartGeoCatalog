

export class DateUtil {
   
    public static YYYYMMDD : string = "YYYY-MM-DD"
    private static _instance: DateUtil;
    
    

  
    private constructor() {
      DateUtil._instance = this;
    }
  
    public  fromDateToString(todayDate : Date) {

        let day : string;
        let month : string;  
        if (   (( todayDate.getMonth() + 1))  <10 ) {
            month = "0" + (( todayDate.getMonth() + 1)) 
        } else {
            month =  ""+(( todayDate.getMonth() + 1)) 
        }
        if (   todayDate.getDate()   <10 ) {
            day = "0" +todayDate.getDate() 
        } else {
            day =  ""+todayDate.getDate() 
        }

        return todayDate.getFullYear() + '-' + month + '-' +  day
    }
  
    public static getInstance(): DateUtil {
      if (!this._instance) {
        this._instance = new DateUtil();
      }
      return this._instance;
    }
  }
  