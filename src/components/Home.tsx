import img from "../image/awsLogo.png" ;
import { Footer } from "./Footer";
export function Home(){
    return(
        <>  
            {/* <div className="home">
                <h1>
                    FaceDetection
                </h1>
                </div>
            */}

                <div className="homePage jumbotron">
                    <div className="col-4"></div>
                    <div className="col-4">
                    <h1>FACE DETECTOR</h1>
                    <img className="imageHome" src={img} alt="" />

                    </div>
                    <div className="col-4"></div>
                    <div className="loader"></div>
                  
                    {/* <button type="button" className="btn btn-warning">Warning</button> */}
                </div>


                <Footer/>
        </>
    )

}