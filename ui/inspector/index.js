import React from 'react';

export default class Inspector extends React.Component {
  getData() {
    return this.props.client.queryManager.getDataWithOptimisticResults();
  }

  render() {
    return (
      <AllRealIds data={this.getData()} />
    );
  }
}

const AllRealIds = ({ data }) => {
  const ids = Object.keys(data).filter(id => id[0] !== '$');

  const sortedIdsWithoutRoot = ids.filter(id => id !== 'ROOT_QUERY').sort();

  // XXX handle root mutation and subscription fields as well
  const rootFirst = ['ROOT_QUERY', ...sortedIdsWithoutRoot];

  return (
    <div>
      {rootFirst.map(id => <StoreTreeFieldSet data={data} dataId={id} expand={false} />)}
    </div>
  );
}

// Props: data, dataId, expand
class StoreTreeFieldSet extends React.Component {
  constructor(props) {
    super();
    this.state = {
      expand: props.expand || props.dataId[0] === '$',
    };

    this.toggleExpand = this.toggleExpand.bind(this);
  }

  getStoreObj() {
    return this.props.data[this.props.dataId];
  }

  shouldDisplayId() {
    return this.props.dataId[0] !== '$';
  }

  keysToDisplay() {
    return Object.keys(this.getStoreObj()).sort();
  }

  renderFieldSet() {
    const storeObj = this.getStoreObj();

    return (
      <div className="store-tree-field-set">
        {this.keysToDisplay().map((key) => (
          <StoreTreeField
            data={this.props.data}
            storeKey={key}
            value={storeObj[key]}
          />
        ))}
      </div>
    )
  }

  toggleExpand() {
    this.setState(({ expand }) => ({ expand: !expand }));
  }

  render() {
    return (
      <div>
        {this.shouldDisplayId() && (
          <span onClick={this.toggleExpand} className="store-tree-ref-id">
            {this.state.expand ? '- ' : '+ '}
            {this.props.dataId}
          </span>
        )}
        {this.state.expand && this.renderFieldSet()}
      </div>
    )
  }
}

const StoreTreeArray = ({ value, data }) => (
  <div>
    {value.map(item => <StoreTreeValue value={item} data={data} /> )}
  </div>
)

const StoreTreeObject = ({ value, data }) => {
  if (isIdReference(value)) {
    console.log(value);
    return (
      <StoreTreeFieldSet dataId={value.id} data={data} />
    )
  }

  return (
    <span>{JSON.stringify(value)}</span>
  );
}

// props: data, value
class StoreTreeValue extends React.Component {
  render() {
    return (
      <span>
        {Array.isArray(this.props.value) ?
          <StoreTreeArray {...this.props} /> :
          <StoreTreeObject {...this.props} />
        }
      </span>
    )
  }
}

// Props: data, storeKey, value
class StoreTreeField extends React.Component {
  render() {
    return (
      <div>
        {this.props.storeKey}:{" "}
        <StoreTreeValue value={this.props.value} data={this.props.data} />
      </div>
    )
  }
}

// Should be imported from AC
function isIdReference(storeObj) {
  return storeObj && storeObj.type === 'id';
}
