import { FlatTreeControl } from '@angular/cdk/tree';

export class CustomTreeControl<T> extends FlatTreeControl<T> {
  /**
   * Recursively expand all parents of the passed node.
   */
  public expandParents(node: T): void {
    const parent = this.getParent(node);

    this.expand(parent);

    if (parent && this.getLevel(parent) > 0) {
      this.expandParents(parent);
    }
  }

  /**
   * Iterate over each node in reverse order and return the first node that has a lower level than the passed node.
   */
  public getParent(node: T): T|null {
    const currentLevel = this.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    const startIndex = this.dataNodes.indexOf(node) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.dataNodes[i];

      if (this.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
  }
}
