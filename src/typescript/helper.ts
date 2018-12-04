
import * as child_process from 'child_process';
import * as fs from 'fs';

export class Helper {
	public static consolelog(str) {
		console.log(str);
	}

	public static wget(url, dir) {
		child_process.spawn('wget', [url, '-P', dir])
	}

  public static fsread(path: string, encoding: string = 'utf8', callback: any) {
    fs.readFile(path, {encoding: encoding, flag: 'r'}, function(err, data){
      callback(err, data);
    });
  }

  public static fsread_sync(path: string, encoding: string = 'utf8'): string {
    return fs.readFileSync(path, {encoding: encoding, flag: 'r'});
  }

  public static fswrite_sync(path: string, data: any, encoding: string = 'utf8') {
    fs.writeFileSync(path, data, {encoding: encoding});
  }

  public static copy_object(obj: any): any {
    return JSON.parse(JSON.stringify(obj));
  }
}
