import React from 'react';
import 'antd/dist/antd.css';

class CustomizedLabel extends React.Component{
    render () {
        const {x, y, stroke, value} = this.props;
            
           return <text x={x} y={y} dy={-4} fill={stroke} fontSize={10} textAnchor="middle">{value} (100%)</text>
      }
}

export default CustomizedLabel;