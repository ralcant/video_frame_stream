import React from 'react';
import videojs from 'video.js'
import PropTypes from 'prop-types';
import 'video.js/dist/video-js.css';
//import 'videojs-contrib-hls/dist/videojs-contrib-hls.js';
// Workaround for webworkify not working with webpack
window.videojs = videojs;
require('videojs-contrib-hls/dist/videojs-contrib-hls.js');

class Player extends React.Component {
    startVideo(video) {
        videojs(video);
    }
    
    render() {
        return (
                <video ref={this.startVideo} width={this.props.width} height={this.props.height} className="video-js vjs-default-skin" controls>
                    <source src={this.props.source} type="application/x-mpegURL" />
                </video>
        );
    }
}

Player.propTypes = {
    width: PropTypes.string.isRequired,
    height: PropTypes.string.isRequired,
    source: PropTypes.string.isRequired,
};

export default Player;