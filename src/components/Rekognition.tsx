import { useRef, useState } from "react";
import AWS, { Credentials } from 'aws-sdk';
import { DetectFacesRequest, FaceDetailList, ImageBlob } from "aws-sdk/clients/rekognition";
import { Card } from "./Card";
import { Home } from "./Home";
import img from "../image/awsLogo.png";
import { FaceBorder } from "./BoundingBox";

export function RekognitionAWS() {
  const [image, setImage] = useState<any>();
  const [load, setLoad] = useState(true);
  const [datas, setDatas] = useState<any>([]);
  const imageInput = useRef<HTMLImageElement>(null) ;

  function DetectFaces(imageData: Blob) {
    AWS.config.region = "eu-west-2";
    var rekognition = new AWS.Rekognition();
    var params = {
      Image: {
        Bytes: imageData
      },
      Attributes: [
        'ALL',
      ]
    };
    rekognition.detectFaces(params, function (err, data: any) {
      if (err) {
        console.log(err, err.stack);
      }
      if(window.onoffline){
        alert("VERIFY YOUR INTERNET CONNEXION")
      }

      else {
        setLoad(false)
        setDatas(data.FaceDetails[0])
        console.log(data.FaceDetails[0])
      }
    });
  }

  const ProcessImage = (event: any) => {

    const file: any = event.target.files[0];
    console.log("Tonga processImage")
    setImage(URL.createObjectURL(event.target.files[0]));

    AnonLog();

    var reader = new FileReader();
    reader.onload = (function (theFile) {
      setLoad(true)

      return function (e: any) {

        var image: any = null;
        var jpg = true;
        try {
          image = atob(e.target.result.split("data:image/jpeg;base64,")[1]);
        } catch (e) {
          jpg = false;
        }
        if (jpg == false) {
          try {
            image = atob(e.target.result.split("data:image/png;base64,")[1]);
          } catch (e) {
            alert("Not an image file Rekognition can process");
            return;
          }
        }

        var length = image.length;
        var imageBytes: any = new ArrayBuffer(length);
        var ua = new Uint8Array(imageBytes);
        for (var i = 0; i < length; i++) {
          ua[i] = image.charCodeAt(i);
        }
        DetectFaces(imageBytes);
      };
    })(file);
    reader.readAsDataURL(file);
  }

  function AnonLog() {
    AWS.config.region = process.env.REACT_APP_REGION;
    AWS.config.credentials = new AWS.CognitoIdentityCredentials({
      IdentityPoolId: process.env.REACT_APP_POOL_ID as string,
    });
  }

  return (
    <>

<nav className="nav">
  <span className=" navbar navbar-brand mb-0 h1">FACE DETECTION</span>

  <label className="custom-file-upload updloadF" htmlFor='fileToUpload' title='image'>
      <svg className="svg" xmlns="http://www.w3.org/2000/svg" width="200" height="50" fill="currentColor" viewBox="0 0 16 16">
        <path d="M15 12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1h1.172a3 3 0 0 0 2.12-.879l.83-.828A1 1 0 0 1 6.827 3h2.344a1 1 0 0 1 .707.293l.828.828A3 3 0 0 0 12.828 5H14a1 1 0 0 1 1 1v6zM2 4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2h-1.172a2 2 0 0 1-1.414-.586l-.828-.828A2 2 0 0 0 9.172 2H6.828a2 2 0 0 0-1.414.586l-.828.828A2 2 0 0 1 3.172 4H2z" />
        <path d="M8 11a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5zm0 1a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 6.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0z" />
      </svg>
    <input className='inputFile' type="file" name="fileToUpload" id="fileToUpload" accept="image/*" onChange={ProcessImage}
    /><i className="bi bi-upload ms-3"></i>
  </label>
</nav>

      {load ? <Home /> :
        <div className="show">
          <div className="col-md-6 img" >
            <img className="card-img-top" src={image} alt="Card image cap" ref={imageInput} />
        
            <FaceBorder 
              HeightBox={datas?.BoundingBox?.Height} 
              WidthBox={datas?.BoundingBox?.Width}
              HeightImg = {imageInput.current?.width||0}
              WidthImg ={imageInput.current?.height||0}
              Left={datas?.BoundingBox?.Left}
              Top={datas?.BoundingBox?.Top}
            />

          </div>

          <div className="col-md-6">
            <div className="column">

              <Card title="BOUNDINGBOX" >
                <div className="card-text">
                  <p>
                  Width : {datas?.BoundingBox?.Width} <br></br>
                  </p>
                  <p>
                  Height : {datas?.BoundingBox?.Height} <br></br>
                  </p>
                  <p>
                  Left : {datas?.BoundingBox?.Left} <br></br>
                  </p>
                  <p>
                  Top : {datas?.BoundingBox?.Top}
                  </p>
                </div>
              </Card>

              <Card title="AGE RANGE">
                <div className="card-text">
                  <p>
                  Low : {datas?.AgeRange?.Low}
                  </p>
                  <p>
                  High : {datas?.AgeRange?.High}
                  </p>
                </div>
              </Card>

              <Card title="SMILE">
                <div className="card-text">
                  <p>
                  Value:{datas?.Smile?.Value.toString()}
                  </p>
                  <p>
                  Confidence : {datas?.Smile?.Confidence}
                  </p>
                </div>
              </Card>

              <Card title="EyeGlasses"  >
                <div className="card-text">
                  <p>
                  Value : {datas?.Eyeglasses?.Value.toString()}
                  </p>
                  <p>
                  Confidence : {datas?.Eyeglasses?.Confidence}
                  </p>
                </div>
              </Card>

              <Card title="Sunglasses">
                <div className="card-text">
                  <p>
                  Value : {datas?.Sunglasses?.Value.toString()}
                  </p>
                  <p>  
                  Confidence : {datas?.Sunglasses?.Confidence}
                  </p>
                </div>
              </Card>

              <Card title="Gender"  >
                <div className="card-text">
                  <p>
                  Value : {datas?.Gender?.Value}
                  </p>
                  <p>
                  Confidence : {datas?.Gender?.Confidence}
                  </p>
                </div>
              </Card>

              <Card title="Beard">
                <div className="card-text">
                  <p>
                  Value : {datas?.Beard?.Value.toString()}
                  </p>
                  <p>
                  Confidence : {datas?.Beard?.Confidence}
                  </p>
                </div>
              </Card>

              <Card title="Mustache">
                <div className="card-text">
                  <p>
                  Value : {datas?.Mustache?.Value.toString()}
                  </p>
                  <p>
                  Confidence : {datas?.Mustache?.Confidence}
                  </p>
                </div>
              </Card>

              <Card title="EyesOpen" >
                <div className="card-text">
                  <p>
                  Value : {datas?.EyesOpen?.Value.toString()}
                  </p>
                  <p>
                  Confidence : {datas?.EyesOpen?.Confidence}
                  </p>
                </div>
              </Card>

              <Card title="MouthOpen" >
                <div className="card-text">
                  <p>
                  Value : {datas?.MouthOpen?.Value.toString()}
                  </p>
                  <p>
                  Confidence : {datas?.MouthOpen?.Confidence}
                  </p>
                </div>
              </Card>

              <Card title="Emotions" >

                {datas?.Emotions?.map((key: any) => (
                  <div className="card-text">
                    <div className="row">
                      <div className="col-4 li">
                     
                        <li key="{item1}"><span className="type">
                            Type : 
                          </span> {key.Type.toLowerCase()} </li>
                      </div>
                      <div className="col-8 li">
                        
                        <li key="{item2}"> 
                        <span className="type">Confidence : </span>
                        {key.Confidence.toFixed(2)}  </li>

                      </div>
                    </div>
                  </div>

                ))}
              </Card>


              <Card title="Landmarks" >
                {datas?.Landmarks?.map((key: any) => (
                  <div className="card-text">
                    <div className="row">
                      <div className="col li">
                        <h4>TYPE</h4>
                        <li key="{item1}"> {key.Type.toLowerCase()} </li>

                      </div>
                      <div className="col li">
                        <h4>X</h4>
                        <li key="{item2}"> {key.X.toFixed(5)}  </li>

                      </div>
                      <div className="col li">
                        <h4>V</h4>
                        <li key="{item3}"> {key.Y.toFixed(5)}  </li>

                      </div>
                    </div>
                  </div>
                ))}
              </Card>

              <Card title="Pose" >
                <div className="card-text">
                  <p>
                  Roll : {datas?.Pose?.Roll}
                  </p>
                  <p>
                  Yaw : {datas?.Pose?.Yaw}
                  </p>
                  <p>
                  Pitch : {datas?.Pose?.Pitch}
                  </p>
                </div>
              </Card>

              <Card title="Quality" >
                <div className="card-text">
                  <p>
                  Brightness : {datas?.Quality?.Brightness}
                  </p>
                  <p>
                  Sharpness : {datas?.Quality?.Sharpness}
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </div>

      }
    </>
  )
}