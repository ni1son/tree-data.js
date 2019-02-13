import uuid from "uuid";

export default class Tree {
    constructor(tree = [], params = {}) {
        this.tree = tree;
        this.params = {
            childrenName: "children",
            idName: "id",
            autoAddingId: true,
            autoAddingChildren: true,
            ...params
        };

        if (this.params.autoAddingChildren || this.params.autoAddingId) {
            this.map((element) => this.processElement(element));
        }
    }

    forEach(callback) {
        const { childrenName } = this.params;

        const forEachTree = (tree, level = 0) => {
            tree.forEach((element, i) => {
                callback(element, i, level);
                if (element[childrenName] && element[childrenName].length > 0) {
                    forEachTree(element[childrenName], ++level);
                }
            });
        };

        forEachTree(this.tree);
        return this;
    }

    map(callback) {
        const { childrenName } = this.params;
        const mapTree = (tree, level = 0) => tree.map((element, i) => ({
            ...(callback(element, i, level)),
            [childrenName]: element[childrenName] ? mapTree(element[childrenName], ++level) : []
        }));

        this.tree = mapTree(this.tree);
        return this;
    }

    reduce(callback, initial) {
        let accumulator = initial;
        this.forEach((item, i, level) => {
            accumulator = callback(accumulator, item, i, level);
        });

        return accumulator;
    }


    find(query) {

        const findOneInTree = (tree) => {

            let foundValue;

            for (const element of tree) {
                if (this.testQuery(element, query)) {
                    foundValue = element;
                    break;
                }
            }

            if (!foundValue) {
                for (const item of tree) {
                    foundValue = findOneInTree(item.children);
                    if (foundValue) break;
                }
            }

            return foundValue;
        };

        return findOneInTree(this.tree);
    }


    /**
     * Return flat array from tree
     *
     * When fields argument is:
     * Default: return array with all elements of tree
     * String: return array with field with key choose
     * Array: return array with objects with selected fields
     */
    flatten(fields = null) {

        const choose = (array) => {
            return array.map((item) => {
                if (!fields) {
                    return item;
                }

                if (typeof fields === "string") {
                    return item[fields];
                }

                if (fields.isArray()) {
                    fields.reduce((acc, field) => {
                        acc[field] = array[field];
                        return acc;
                    }, {});
                }
            });
        };

        const flattenTree = (tree) => [...(this.hasChildren(tree) ? flattenTree(this.getChildren(tree)) : []), ...choose(tree)];

        return flattenTree(this.tree);
    }

    addChild(query, childElement) { // +

        const { childrenName } = this.params;

        const addChildInTree = (tree, child) => {

            return tree.map((element) => {
                const children = this.hasChildren(element) ? addChildInTree(this.getChildren(element), child) : [];

                return (this.testQuery(element, query)) ?
                    { ...element, [childrenName]: [...children, child] } :
                    { ...element, [childrenName]: children };
            });
        };

        this.tree = addChildInTree(this.tree, this.processElement(childElement));
        return this;
    }

    addParent(query, parentElement) {
        //todo:
    }

    filter(query) {
        const { childrenName } = this.params;
        const filterTree = (tree) => {
            return tree.filter((item) => this.testQuery(item, query)).map((item) => {
                if (this.hasChildren(item)) {
                    return { ...item, [childrenName]: filterTree(this.getChildren(item)) };
                }
            });
        };

        this.tree = filterTree(this.tree);
        return this;
    }

    getObject() { // +
        return this.tree;
    }

    setObject(tree) { // +
        this.tree = tree;
    }

    addIdForElementIfNotExists(element) {
        const { idName } = this.params;
        return element[idName] ? element : { ...element, [idName]: uuid() };
    }

    addEmptyChildrenForElementIfNotExists(element) {
        const { childrenName } = this.params;
        return element[childrenName] ? element : { ...element, [childrenName]: []};
    }

    testQuery(item, query) { // +

        const { idName } = this.params;

        if (typeof query === "string" || typeof query === "number") {
            if (item[idName] === query) {
                return true;
            }
        } else if (typeof query === "object") {
            if (Object.keys(query).reduce((acc, key) => {
                return acc && item[key] === query[key];
            }, true)) {
                return true;
            }
        }

        return false;
    }

    hasChildren(item) { // +
        const { childrenName } = this.params;
        return item[childrenName] && item[childrenName].length;
    }

    getChildren(item) { // +
        const { childrenName } = this.params;
        return this.hasChildren(item) ? item[childrenName] : [];
    }

    processElement(element) {
        const elementWithId = this.params.autoAddingId ? this.addIdForElementIfNotExists(element) : element;
        return this.params.autoAddingChildren ? this.addEmptyChildrenForElementIfNotExists(elementWithId) : elementWithId;
    }

}

