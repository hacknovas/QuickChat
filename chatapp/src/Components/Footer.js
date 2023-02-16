import React from 'react'

export default function Footer() {
    return (
        <>
            <div className="d-flex flex-wrap flex-column border bg-light align-self-baseline" style={{ fillOpacity: "1" }} >
                <div className='d-flex flex-wrap justify-content-between'>
                    <div className="m-4 " >
                        <img src="./logo.png" style={{
                            height: "10vmin"
                        }} />
                    </div>
                    <div>
                        <div className="mt-3">
                            <div className="my-1 ">
                                <p >- Lorem ipsum dolor sit amet consectetur adipisicing elit.  <br /> Lorem, ipsum dolor sit amet consectetur .
                                </p>
                            </div>
                            <div className="  my-1">- Currently v1.1.0.</div>
                        </div>
                    </div>
                </div>
                <div className=" text-center text-dark ">
                    <div className="text-center border-top d-inline pt-1 rounded">@CreatedBy_HackNova</div><br />
                    <a href="mailto: creatives.doni@gmail.com" style={{ textDecoration: "none" }}> creatives.doni@gmail.com</a>
                </div>
            </div>
        </>
    )
}
