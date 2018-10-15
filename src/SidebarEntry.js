import React, {Component} from 'react';

type Props = {
  onClick: {},
  iconName: string,
  page: string,
  currentPage: string,
  text: string,
}

class SidebarEntry extends Component<Props> {
  resize = (e) => {
    const newWidth = Math.min(500, e.clientX + 2);
    this.setState({width: newWidth})
  }

  resizeDone = (e) => {
    document.body.onmousemove = null;
    document.body.onmouseup = null;
  }

  beginResize = (e) => {
    document.body.onmousemove = this.resize;
    document.body.onmouseup = this.resizeDone;
  }

  unauthorize = () => {
    MusicKit.getInstance().unauthorize();
    location.reload();
  }

  render() {
    const {onClick, iconName, page, currentPage, text} = this.props;

    let className = 'sidebar_entry';
    if (page != '' && currentPage == page) {
      className += ' selected';
    }
    return (
        <div className={className} onMouseDown={() => {onClick();}}>
          <i className='material-icons'>{iconName}</i>{text}</div>
      );
  }
}

SidebarEntry.defaultProps = {
  onClick: () => {},
  page: '',
  currentPage: '',
};

export default SidebarEntry;
