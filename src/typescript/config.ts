import { Helper } from './helper'

declare var process: any;

export class Config {
  static readonly root_dir = __dirname + '/..';
  static readonly config_file_path = Config.root_dir + '/crawler-config.json';
  
  private static config_obj: any = {};
  private static out_dir = './img';
  private static browser_headless = false;

  public static init() {
    Config.read_config();
    Config.read_command_options();
  }

  public static get_root_dir(): string {
    return Config.root_dir;
  }

  public static read_config() {
    const config_str = Helper.fsread_sync(Config.config_file_path);
    Config.config_obj = JSON.parse(config_str);
    if( Config.config_obj.outDir ) {
      Config.out_dir = Config.config_obj.outDir;
    }
  }

  public static save_config() {
    Helper.fswrite_sync(Config.config_file_path, JSON.stringify(Config.config_obj));
  }

  public static read_command_options() {
    for( let i = 2; i < process.argv.length; i++ ) {
      if (process.argv[i] == '--headless') Config.browser_headless = true;
    }
  }

  public static get_config_obj(): any{
    return Helper.copy_object(Config.config_obj);
  }

  public static get_out_dir_path(): string {
    return Config.out_dir;
  }

  public static get_targets(): any {
    return Helper.copy_object(Config.config_obj.targets);
  }

  public static get_site_config(person_index: number, site_index: number): any {
    return Helper.copy_object(Config.config_obj.targets[person_index].sites[site_index]);
  }

  public static get_person_num(): number {
    return Config.config_obj.targets.length;
  }

  public static get_site_num(person_index: number): number {
    return Config.config_obj.targets[person_index].sites.length;
  }

  public static update_latest_image(url: string, person_index: number, site_index: number) {
    console.log('update_latest_image', url);
    Config.config_obj.targets[person_index].sites[site_index].latest_image = url;
  }

  public static get_latest_image(person_index: number, site_index: number ) {
    return Config.config_obj.targets[person_index].sites[site_index].latest_image;
  }

  public static is_headless(): any {
    return Config.browser_headless;
  }

}
