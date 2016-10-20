import graphql from 'graphql-anywhere';
import { getFragmentDefinitions, addFragmentsToDocument } from 'apollo-client/queries/getFromAST';

export default class Fragment {
  constructor(document, ...children) {
    this.document = document;
    this.children = children;

    this.propType = this.propType.bind(this);
  }

  childFragments() {
    return [].concat(...this.children.map(c => c.fragments()));
  }

  fragmentDocument() {
    return addFragmentsToDocument(this.document, this.childFragments());
  }

  fragments() {
    return getFragmentDefinitions(this.fragmentDocument());
  }

  filter(data) {
    const resolver = (fieldName, root, args, context, info) => root[info.resultKey];

    return graphql(resolver, this.fragmentDocument(), data);
  }

  check(data) {
    const resolver = (fieldName, root, args, context, info) => {
      if (!{}.hasOwnProperty.call(root, info.resultKey)) {
        throw new Error(`${info.resultKey} missing on ${root}`);
      }
    };
    graphql(resolver, this.fragmentDocument(), data);
  }

  propType(props, propName) {
    const prop = props[propName];
    try {
      this.check(prop);
      return null;
    } catch (e) {
      // Need a much better error.
      // Also we aren't checking for extra fields
      return e;
    }
  }
}
