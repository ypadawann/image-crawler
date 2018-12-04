import {Builder, By} from 'selenium-webdriver';
import {Options} from 'selenium-webdriver/chrome';


import {Helper} from './helper';
import {Config} from './config';
import {LineImageCrawler} from './line';
declare var process: any;


class CrawlerCtrl {
  private driver_ctrl: DriverCtrl;
  private person_index = 0;
  private site_index = 0;

  start() {
    this.driver_ctrl = new DriverCtrl(Config.is_headless);
    this.crawlPerson().then(function(){
      console.log(Config.get_config_obj());
      Config.save_config();
    });
  }

  crawlPerson(): Promise<any> {
    let _this = this;
    if( Config.get_person_num() <= _this.person_index ) return;
    _this.site_index = 0;
    return _this.crawlSite().then(function(){
      _this.person_index++;
      return _this.crawlPerson();
    });
  }


  crawlSite(): Promise<any> {
    let _this = this;
    if( Config.get_site_num(_this.person_index) <= _this.site_index ) return;
    //const site_obj = site_arr[index];
    const name = Config.get_config_obj().targets[_this.person_index].name;
    const site_config = Config.get_site_config(_this.person_index, _this.site_index);
    const url = site_config.url;
    let cls = null;
    switch ( site_config['type'] ) {
      case 'lineblog':
        cls = new LineImageCrawler(site_config, Config.get_out_dir_path()+name+'/lineblog');
      default:
    }
    if(cls == null) return;
    return cls.getImages(_this.driver_ctrl.get_driver()).then(function(){
      Config.update_latest_image(cls.get_latest_image_url(), _this.person_index, _this.site_index);
      _this.site_index++;
      return _this.crawlSite();
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

