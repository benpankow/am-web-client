import React, { Component } from "react";

type Props = {
  checked: {},
  onChange: {}
};

// Stylized Checkbox page
class Checkbox extends Component<Props, State> {
  render() {
    const { checked, onChange } = this.props;
    return (
      <div className={"checkbox" + (checked ? " checked" : "")}>
        <input
          type="checkbox"
          checked={checked}
          onChange={e => {
            onChange(e.target.checked);
          }}
        />
        <i className="material-icons">check</i>
      </div>
    );
  }
}

export default Checkbox;
