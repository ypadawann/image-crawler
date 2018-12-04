import {By} from 'selenium-webdriver';

import {Helper} from './helper';

export class LineImageCrawler {
  site_config: any;
	top_url: string;
	page_num: number;
  dir_path: string;
  latest_image: string = null;
  constructor(site_config: any, dir_path: string) {
    this.site_config = site_config;
    this.page_num = 1;
    this.dir_path = dir_path;
    console.log('dir_path: ', this.dir_path);
	}

  get_latest_image_url(): string {
    return this.latest_image;
  }

	getImages(driver: any): Promise<any> {
		return this.getImagesFromPage(driver);
	}

	getImagesFromPage(driver: any): Promise<any> {
		console.log('getImagesFromPage', this.page_num);
		const _this = this;
		let elements = [];
		const url = _this.site_config.url + '?p=' + _this.page_num;
		return driver.get(url).then(function(){
			console.log('get', url);
			return driver.findElement(By.id("content"));
		}).then(function(el){
			return driver.findElements(By.css('.article-body img'));
		}).then(function(els){
			for( let i = 0; i < els.length; i++ ){
				elements.push(els[i]);
			}
			return;
		}).then(function(){
			return _this.getImageFromElement(elements, 0);
		}).then(function(){
			_this.page_num ++;
			return _this.getImagesFromPage(driver);
		}).catch(function(err){
			return;
			console.log(err);
			console.error(err.method);
		});
	}

	getImageFromElement(elements: any, index: number): Promise<any> {
    const _this = this
    if( elements.length <= index+1 ) return;
    let src: string
    return elements[index].getAttribute('class').then(function(class_string){
      if(class_string.split(' ').includes('lineemoji')) return;
      return _this.getUrlFromElement(elements[index]);
    }).then(function(url){
      if(url != null) {
        console.log(url);
        if(_this.latest_image == null ) _this.latest_image = url;
        if( _this.site_config.latest_image ) {
          if( _this.site_config.latest_image === url ) return;
        }
        Helper.wget(url, _this.dir_path);
      }
      return _this.getImageFromElement(elements, index+1);
    }).catch(function(err){
			console.error(err);
		})
	}

  getUrlFromElement(element: any): Promise<any> {
    return element.findElement(By.xpath('..')).then(function(a_tag){
      return a_tag.getAttribute('href');
    }).then(function(href){
      if( href != null ) return href;
      return element.getAttribute('src');
    }).catch(function(err){
      console.log(err);
      return null;
    });
  }


}

