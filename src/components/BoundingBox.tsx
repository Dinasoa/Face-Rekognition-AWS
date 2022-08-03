import React from 'react';

interface BorderProperties {
    HeightBox : number 
    WidthBox : number 
    HeightImg : number
    WidthImg : number
    Left : number
    Top : number
}


export function FaceBorder({HeightBox , WidthBox ,  HeightImg , WidthImg , Left , Top}: BorderProperties) {
    console.log("faceBorder")
    console.log(HeightBox , WidthBox ,  HeightImg , WidthImg , Left , Top)

    return(
        <> 
            <div className="box"  style={{
                "position" : "absolute",
                "height" : `${HeightBox * 600}px`,
                "left" : `${Left * 600}px`,
                "top" : `${Top * 600}px`,
                "width" : `${WidthBox * 600}px` ,
            }}>
            </div>
        </>
    );
}