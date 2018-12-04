
import {Helper} from './helper';

export class SiteCrawler {
  protected site_config: any;
  protected page_num: number;
  protected dir_path: string;
  protected latest_image: string;
  protected is_finished: boolean;
  
  constructor(site_config: any, dir_path: string){
    this.site_config = site_config;
    this.dir_path = dir_path;
    this.page_num = 1;
    this.is_finished = false;
    console.log('dir_path: ', this.dir_path);
  }

  public get_latest_image_url(): string {
    return this.latest_image;
  }

  public getImages(driver: any): Promise<any> {
    return this.getImagesFromPage(driver);
  }

  getImagesFromPage(driver: any) {
    return null;
  }

  protected handle_image_url(url: string) {
    if( url == null ) return;
    console.log(url);
    if(this.latest_image == null ) this.latest_image = url;
    if( this.site_config.latest_image ) {
      if( this.site_config.latest_image === url ) {
        this.is_finished = true;
      };
    }
    Helper.wget(url, this.dir_path);
    return;
  }
}
