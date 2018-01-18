import React from 'react';
import FontAwesomeIcon from '@fortawesome/react-fontawesome';

import styles from '../../css/buttons.css';

const LinkButton = (props) => {
  if (props.download) {
    return(
      <a className={props.className + ' button'} href={props.url} download>
        <FontAwesomeIcon icon="download" />
        Download {props.text}
      </a>
    )
  }
  else if (props.newTab) {
    return(
      <a className={props.className + ' button'} href={props.url}
        target="_blank">
        <FontAwesomeIcon icon={props.icon} />
        {props.text}
      </a>
    )
  }
  else {
    return(
      <a className={props.className + ' button'} href={props.url}>
        <FontAwesomeIcon icon={props.icon} />
        {props.text}
      </a>
    )
  }
}

export default LinkButton;
