import React, { Component } from "react";

type Props = {
  onClick: {},
  iconName: string,
  page: string,
  currentPage: string,
  text: string
};

// Individual entry in sidebar (ie Sign Out, Songs, etc)
class SidebarEntry extends Component<Props> {
  render() {
    const { onClick, iconName, page, currentPage, text } = this.props;

    let className = "sidebar_entry";
    if (page != "" && currentPage == page) {
      className += " selected";
    }
    return (
      <div
        className={className}
        onMouseDown={() => {
          onClick();
        }}
      >
        <i className="material-icons">{iconName}</i>
        {text}
      </div>
    );
  }
}

SidebarEntry.defaultProps = {
  onClick: () => {},
  page: "",
  currentPage: ""
};

export default SidebarEntry;
