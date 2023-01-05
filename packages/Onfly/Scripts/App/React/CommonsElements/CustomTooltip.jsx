import React from 'react';
import createReactClass from 'create-react-class';

// Material UI
import Tooltip from '@material-ui/core/Tooltip';

const CustomTooltip = createReactClass({
  render() {
    const text = this.props.Text;
    const maxCharacters = this.props.MaxCharacters;
    let placement = 'right';

    if (this.props.Placement != null && this.props.Placement != '') {
      placement = this.props.Placement;
    }

    if (
      text != null &&
      text != '' &&
      maxCharacters != null &&
      maxCharacters > 0 &&
      text.length > maxCharacters
    ) {
      let tooltip = text.substring(0, maxCharacters);
      tooltip += '...';

      return (
        <Tooltip title={text} placement={placement}>
          <span className="text">{tooltip}</span>
        </Tooltip>
      );
    }

    return <span className={this.props.ClassName}>{text}</span>;
  },
});

export default CustomTooltip;