import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Route, Router, RouterStateSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})

/**
 * PathResolveService service which is used within 404 not found component.
 *
 * @link https://bobrov.dev/blog/angular-smart-404-page/
 */
export class PathResolveService implements Resolve<string | null> {
  private paths = [];

  /**
   * Method to get path threshold.
   *
   * @param {string} path
   *
   * @return {number}
   */
  private static getThreshold(path: string): number {
    return path.length < 5 ? 3 : 5;
  }

  /**
   * Method to sort dictionary paths.
   *
   * @param {string} typoPath
   * @param {string} dictionary
   */
  private static sortByDistances(typoPath: string, dictionary: string[]): void {
    const pathsDistance = {} as { [name: string]: number };

    dictionary.sort((a, b) => {
      if (!(a in pathsDistance)) {
        pathsDistance[a] = PathResolveService.levenshtein(a, typoPath);
      }
      if (!(b in pathsDistance)) {
        pathsDistance[b] = PathResolveService.levenshtein(b, typoPath);
      }

      return pathsDistance[a] - pathsDistance[b];
    });
  }

  /**
   * @param {string} a
   * @param {string} b
   */
  private static levenshtein(a: string, b: string): number {
    if (a.length === 0) {
      return b.length;
    }

    if (b.length === 0) {
      return a.length;
    }

    const matrix = [];

    // increment along the first column of each row
    for (let i = 0; i <= b.length; i++) {
      matrix[i] = [i];
    }

    // increment each column in the first row
    for (let j = 0; j <= a.length; j++) {
      matrix[0][j] = j;
    }

    // Fill in the rest of the matrix
    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1, // substitution
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1, // deletion
          );
        }
      }
    }

    return matrix[b.length][a.length];
  }

  /**
   * Constructor of the class.
   *
   * @param {Router} router
   */
  public constructor(private router: Router) {
    this.determinePaths('', this.router.config);

    this.paths = this.paths
      .filter((path: string) => {
        return path.length > 1 && path !== '/**';
      })
      .map((path: string) => path.substring(1));
  }

  /**
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot}    state
   *
   * @return {string|null}
   */
  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): string|null {
    const typoPath = state.url;
    const threshold = PathResolveService.getThreshold(typoPath);
    const dictionary = this.paths.filter((path: string) => Math.abs(path.length - typoPath.length) <= threshold);

    if (!dictionary.length) {
      return null;
    }

    PathResolveService.sortByDistances(typoPath, dictionary);

    return `/${dictionary[0]}`;
  }

  /**
   * Method to determine all application route paths.
   *
   * @param {string}  parent
   * @param {Route[]} config
   */
  private determinePaths(parent: string, config: Route[]): void {
    config.map((route: Route) => {
      if (route.component) {
        this.paths.push(parent + '/' + route.path);
      }

      if (route.children) {
        const currentPath = route.path ? parent + '/' + route.path : parent;

        this.determinePaths(currentPath, route.children);
      }
    });
  }
}
