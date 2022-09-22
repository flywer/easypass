import { Injectable } from 'einf'
import User from "@main/model/user";

@Injectable()
export class AppService {
  public getDelayTime(): number {
    return 2
  }

  public getUserInfo(){

  }
}
