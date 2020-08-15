function get_styled_path(
    video_name,
    style_name,
    frame_n,
    w, 
    h
){
    return `video_${video_name}_style_${style_name}_frame_${frame_n}_w${w}_h${h}`
}


export default get_styled_path;