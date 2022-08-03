type Props = {
  title: string;
  // sousTitle: string;
  children?: JSX.Element | JSX.Element[] | React.ReactNode;
};

export function Card({ title, children}: Props) {
  return (
    <>
      <div className='detectFace'>
        <div className="FaceDetails">
          <div className="card bg-light mb-3" >
            <div className="card-header headerTitle">{title.toUpperCase()}</div>
            <div className="card-body">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 