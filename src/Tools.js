const renderPrediction = (idx, prediction) => {
    const [x, y, width, height] = prediction['bbox'];
    const nameTag = prediction['class'];
    // console.log(nameTag);
    const divStyle = {
        left: x,
        top: y,
        width: width,
        height: height,
        color: 'white'
    };

    return(
        <div key={idx} className="bBox" style={divStyle} onClick={() => {alert(nameTag)}}>
            <span className="nameTag">{nameTag}</span>
        </div>
    );
}

export default renderPrediction;