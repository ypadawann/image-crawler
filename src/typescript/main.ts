import {Builder, By} from 'selenium-webdriver';
import {Options} from 'selenium-webdriver/chrome';


import {Helper} from './helper';
import {Config} from './config';
import {LineImageCrawler} from './line';
declare var process: any;


class CrawlerCtrl {
  private driver_ctrl: DriverCtrl;

  start() {
    this.driver_ctrl = new DriverCtrl(Config.is_headless);
    const target_arr = Config.get_targets();
    this.crawlPerson(target_arr, 0);
  }

  crawlPerson(person_arr: any, index: number = 0): Promise<any> {
    let _this = this;
    if( person_arr.length <= index ) return;
    let person_obj = person_arr[index];
    console.log(person_obj);
    const name = person_obj.name;
    return _this.crawlSite(person_obj.sites, 0, name).then(function(){
      return _this.crawlPerson(person_arr, index+1);
    });
  }


  crawlSite(site_arr: any, index: number, name: string = ''): Promise<any> {
    let _this = this;
    if( site_arr.length <= index ) return;
    const site_obj = site_arr[index];
    const site_type = site_obj['type'];
    const url = site_obj.url;
    let cls = null;
    switch ( site_obj['type'] ) {
      case 'lineblog':
        cls = new LineImageCrawler(url, Config.get_out_dir_path()+name+'/lineblog');
      default:
    }
    if(cls == null) return;
    return cls.getImages(_this.driver_ctrl.get_driver()).then(function(){
      return _this.crawlSite(site_arr, index+1);
    }).then(function(){
      cls = null;
      return;
    });
  }

}

class DriverCtrl {
  private driver: any;
  constructor(is_headless: any) {
    let opt = new Options;
    if(is_headless()) opt.headless();
    this.driver = new Builder().forBrowser('chrome').setChromeOptions(opt).build();
  }

  get_driver() {
    return this.driver;
  }
}

Config.init();
let clw = new CrawlerCtrl();
clw.start();

