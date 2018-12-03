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

  public static read_command_options() {
    for( let i = 2; i < process.argv.length; i++ ) {
      if (process.argv[i] == '--headless') Config.browser_headless = true;
    }
  }

  public static get_config_obj(): any{
    return Config.config_obj;
  }

  public static get_out_dir_path(): string {
    return Config.out_dir;
  }

  public static get_targets(): any {
    return Config.config_obj.targets;
  }

  public static is_headless(): any {
    return Config.browser_headless;
  }

}
