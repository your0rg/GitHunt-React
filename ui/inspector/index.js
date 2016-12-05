import React from 'react';

export default class Inspector extends React.Component {
  getData() {
    return this.props.client.queryManager.getDataWithOptimisticResults();
  }

  render() {
    return (
      <div>
        <StoreTreeFieldSet data={this.getData()} dataId="ROOT_QUERY" />
      </div>
    );
  }
}

// Props: data, dataId
class StoreTreeFieldSet extends React.Component {
  getStoreObj() {
    return this.props.data[this.props.dataId];
  }

  render() {
    const storeObj = this.getStoreObj();
    return (
      <div>
        {this.props.dataId}
        <div className="store-tree-field-set">
          {Object.keys(storeObj).map((key) => (
            <StoreTreeField
              data={this.props.data}
              storeKey={key}
              value={storeObj[key]}
            />
          ))}
        </div>
      </div>
    )
  }
}

class StoreTreeArray extends React.Component {

}

// Props: data, storeKey, value
class StoreTreeField extends React.Component {
  render() {
    return (
      <div>
        {this.props.storeKey}
        {JSON.stringify(this.props.value, null, 2)}
      </div>
    )
  }
}
