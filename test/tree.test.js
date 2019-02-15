import Tree from '../src/tree.js'

describe('creating of tree', () => {

  test('creation of object', () => {
    const tree = new Tree()
    expect(tree).isObject()
    expect(tree).isPrototypeOf(Tree)
  })

  test('creation of object with params', ()=> {

  })
})
