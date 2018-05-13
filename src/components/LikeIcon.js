import React from 'react';
import Icon from "material-ui/es/Icon/Icon";

const LikeIcon = props => {

    let newProps = Object.assign({}, props);
    delete newProps.hoverColor;
    delete newProps.iconValue;

    return (
        <Icon {...newProps}>{props.iconValue}</Icon>
    );

};

export default LikeIcon;