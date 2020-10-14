import React, { Component } from 'react';
import ReactMarkdown from 'react-markdown';
import { motion } from 'framer-motion';

function hexToRgb(hex) {
  // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
  var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  hex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

class Cards extends Component {
  render() {
    let issueList = [];

    let data = this.props.data;

    for (let i = 0; i < data.length; i++) {
      let badgeList = [];
      for (let labelName in data[i].labels) {
        const rgb = hexToRgb(data[i].labels[labelName]);

        const brightness = Math.round(
          (parseInt(rgb['r']) * 299 +
            parseInt(rgb['g']) * 587 +
            parseInt(rgb['b']) * 114) /
            1000
        );
        const textColour = brightness > 125 ? 'black' : 'white';
        badgeList.push(
          <span
            className="badge badge-pill badge-light"
            style={{
              backgroundColor: data[i].labels[labelName],
              color: textColour,
            }}
            key={labelName}
          >
            {labelName}
          </span>
        );
      }

      issueList.push(
        <motion.div className="card" key={i.toString()} whileHover={{ y: -5 }}>
          <div className="card-body">
            <h5 className="card-title">
              <a href={data[i].issueHref} className="card-link">
                <b>{data[i].issueName}</b>
              </a>
            </h5>
            <h6 className="card-subtitle mb-2 text-muted">
              <a href={data[i].repoHref} className="card-link">
                {data[i].repoName}
              </a>
            </h6>
            <ReactMarkdown source={data[i].article} />
            {badgeList}
          </div>
        </motion.div>
      );
    }

    return <div className="card-columns">{issueList}</div>;
  }
}

export default Cards;
