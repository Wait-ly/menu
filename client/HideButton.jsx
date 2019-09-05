import React from 'react';
import styles from './css_modules/hideButton.css';

class HideButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hovered: false,
    };
    this.handleOnHover = this.handleOnHover.bind(this);
  }

  handleOnHover() {
    const { hovered } = this.state;
    this.setState({ hovered: !hovered });
  }

  render() {
    const { fullMenuIsVisible, handleVisibility } = this.props;
    const { hovered } = this.state;

    return (
      <button type="button" onMouseEnter={this.handleOnHover} onMouseLeave={this.handleOnHover} className={hovered ? styles.hovered : styles.unhovered} onClick={() => handleVisibility()}>{fullMenuIsVisible ? 'Hide Menu' : 'Show Full Menu'}</button>
    );
  }
}

export default HideButton;
