import { environment } from '../../../environments/environment';
import { ApplicationConfigInterface } from '../interfaces';

export class ConfigService {
  static settings: ApplicationConfigInterface|undefined;
  static done: boolean;
  static loginUri: string;

  /**
   * Static method to load configuration JSON file for current environment.
   *
   * This method is called from `main.ts` before application is bootstrapped, so that we can ensure that necessary
   * configurations are set to this class.
   *
   * Note that this uses `fetch` method which might not be supported by all browsers - we need to check what is
   * actually used from compiled output of prod build.
   *
   * @return Promise
   */
  public static loadStatic(): Promise<void> {
    const jsonFile = `/assets/config/config.${environment.name}.json`;

    return new Promise<void>((resolve, reject) => {
      fetch(jsonFile)
        .then((response) => {
          response
            .json()
            .then((settings: ApplicationConfigInterface) => {
              ConfigService.settings = settings as ApplicationConfigInterface;
              ConfigService.loginUri = ConfigService.settings.apiUri + '/api/v1/user/authenticate';
              ConfigService.done = true;

              resolve();
            });
        })
        .catch((response: any) => {
          reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
        });
    });
  }
}
