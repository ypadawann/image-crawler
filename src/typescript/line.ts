import {By} from 'selenium-webdriver';

import {Helper} from './helper';
import {SiteCrawler} from './site';

export class LineImageCrawler extends SiteCrawler{

  constructor(site_config: any, dir_path: string) {
    super(site_config, dir_path);
	}

	getImagesFromPage(driver: any): Promise<any> {
		console.log('getImagesFromPage', this.page_num);
		const _this = this;
    if(14 <= _this.page_num) return;
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
      if( _this.is_finished ) return;
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
      _this.handle_image_url(url);
      if( _this.is_finished ) return;
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

